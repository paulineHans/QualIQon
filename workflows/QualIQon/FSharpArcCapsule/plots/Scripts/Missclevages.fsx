#r "nuget: ProteomIQon, 0.0.10"
#r "nuget: Plotly.NET, 5.0.0"
#r "nuget: Plotly.NET.Interactive, 5.0.0"
#r "nuget: Fable.React, 9.4.0"
#r "nuget: Deedle, 3.0.0"
#r "nuget: Deedle.Interactive, 3.0.0"
#r "nuget: Plotly.NET.ImageExport, 6.1.0"
open ProteomIQon.Dto
open Plotly.NET
open Plotly.NET.Interactive
open Plotly.NET.ConfigObjects
open System.IO 
open System
open Plotly.NET.TraceObjects
open Plotly.NET.LayoutObjects
open FSharpAux.IO.SchemaReader.Attribute
open Giraffe.ViewEngine.HtmlElements
open Deedle 
open Deedle.Interactive
open Plotly.NET.ImageExport
// open Fable.React
// open Fable.React.Props


let customCulture: Globalization.CultureInfo = System.Threading.Thread.CurrentThread.CurrentCulture.Clone() :?> Globalization.CultureInfo
customCulture.NumberFormat.NumberDecimalSeparator <- "."
System.Threading.Thread.CurrentThread.CurrentCulture <- customCulture

// Miscleavages 
type Parameters = 
    {
        MC : int
    }




let layout = 
    let axsisLayout () =
        LinearAxis.init (
            ShowLine = true,
            ZeroLine = false,
            TickLabelStep = 1,
            ShowTickLabels = true,
            Mirror = StyleParam.Mirror.All,
            TickFont = (Font.init (Size = 20))    
        )
    
    let majorLayout =    
            Layout.init (
                Title.init(
                        Text="<b>Overview of Misscleavages in <i>Chlamydomonas reinhardtii<i><b>", 
                        Font = (Font.init (Family = StyleParam.FontFamily.Arial, Size= 30, Color = Color.fromString "Black")), 
                        XAnchor = StyleParam.XAnchorPosition.Center,
                        AutoMargin = false,
                        Standoff = 2
                    ),
                Font = Font.init (Family = StyleParam.FontFamily.Arial, Size = 20, Color = Color.fromString "Black")
                )
            |> Layout.setLinearAxis ((StyleParam.SubPlotId.XAxis 1), (axsisLayout ()))
            |> Layout.setLinearAxis ((StyleParam.SubPlotId.YAxis 1), (axsisLayout ()))

    let traceLayout = 
            [Trace2D.initScatter(
                Trace2DStyle.Scatter(Marker = Marker.init (AutoColorScale = true)))]
        
    let templateYeast = Template.init (majorLayout, traceLayout)
    templateYeast

let miscleavagesHistogram (filepath) = 
    filepath
    //|> Array.fold (fun (c : float, acc : GenericChart list) (x:(string*(Parameters array))) ->  
    |> Array.fold (fun (c : float, acc : list<GenericChart*string>) (x:(string*(Parameters array))) ->  
        let file = (fst x ).Split("TM").[1]
        let data = snd x            
        let groupMC =             
            data
            |> Array.map (fun x -> x.MC)
            |> Array.countBy id 
            |> Array.sortBy fst
        let sumAllMC = 
            groupMC |> Array.sumBy snd |> float
        let getPerMC = 
            groupMC |> Array.map (fun (key,count) -> 
               string key, (((count |> float) /sumAllMC)))
            |> Array.tail 
        let maxN = 
            getPerMC
            |> Array.maxBy snd 
            |> snd 
        let newMax = 
            if maxN > c then maxN
            else c
        let chart = 
            Chart.Column (
                keysValues = getPerMC,
                MarkerColor = Color.fromColors [Color.fromHex("#FFA252"); Color.fromHex("#E31B4C")]
                ) 
            |> Chart.withTraceInfo (ShowLegend = false)
        (newMax, (chart,file) :: acc) 
    )

        (0,[])
//miscleavagesHistogram 

let proteomIQonToParams (path: string) =
    let fileNames = System.IO.Path.GetFileNameWithoutExtension path
    let files = 
        FSharpAux.IO.SchemaReader.Csv.CsvReader<PSMStatisticsResult>().ReadFile(path, '\t', false, 1)
        |> Seq.toArray
        |> Array.map (fun x -> 
            {
                MC = x.MissCleavages
            }
        )  
    fileNames,files |> Seq.toArray 

    

//get the data out of a FragPipe File
let FragPipeToParams (path :string)= 
    let fileNames = System.IO.Path.GetFileNameWithoutExtension path
    let files = Deedle.Frame.ReadCsv (path, hasHeaders =  true,  separators = "\t")
    let columns = 
        files 
        |> Frame.getCol ("Number of Missed Cleavages")
        |> Series.values
        |> Seq.map (fun o -> 
            {
               MC = o
            } 

        )
        |> Seq.toArray 
    fileNames,columns

let maxQuantToParams (path: string) = 
    let fileNames = System.IO.Path.GetFileNameWithoutExtension path 
    let files = Deedle.Frame.ReadCsv (path, hasHeaders =  true,  separators = "\t")
    let columns = 
        files 
        |> Frame.getCol ("Missed cleavages")
        |> Series.values
        |> Seq.map (fun x -> 
            {
                MC = x
            }
        )
        |> Seq.toArray
    fileNames, columns


// when argument is ProteomIQon the proteomIqon is gonna be executed else FragPipe 
let matchingForFile (arguments: string) =  
    match arguments with 
    | "ProteomIQon" -> proteomIQonToParams
    | "FragPipe" -> FragPipeToParams
    | "MaxQuant" -> maxQuantToParams
    | _ -> failwith "unknown pattern"

// collecting Files for FragPipe data 

let rec searchFiles (directoryName: string) (fileName: string) : string[] =
    // Get files in the current directory that match the filename.
    let currentFiles = Directory.GetFiles(directoryName,fileName )
    
    // Get all subdirectories.
    let subDirectories = Directory.GetDirectories(directoryName)
    
    // Recursively search each subdirectory.
    let subDirFiles =
        subDirectories
        |> Array.collect (fun subDir -> searchFiles subDir fileName)
    
    // Combine files from the current directory and all subdirectories.
    Array.append currentFiles subDirFiles

let matchingDirecoryPath (sndArg : string) = 
    match sndArg with
    | "ProteomIQon" -> "*.qpsm"
    | "FragPipe" -> "psm.tsv"
    | "MaxQuant" -> "evidence.txt"
    | _ -> failwith "no file found"
let finalChartHisto (directoryName :string) pipeline =
    let directoryPath = (String.concat "" [| "./arc/runs" ;directoryName|])
    //callt function with pipeline parameter, which is the equivalent to sndArg
    let searchpattern  = matchingDirecoryPath pipeline
    //called searchFile function with directroypath and searchpattern 
    let allData  = searchFiles directoryPath searchpattern
    let paramsArray =
        allData
        |> Array.map (matchingForFile pipeline)
        |> Array.sortDescending 
    let execution = paramsArray |> miscleavagesHistogram



    let maxY,chartListRaw = execution 
    let chartList,titlList =List.unzip chartListRaw
    let chartListMaxY = 
        chartList
        |> List.map (fun x  -> 
            x
            |> Chart.withTemplate layout
            |> Chart.withYAxisStyle(TitleText = "<b>Misscleavages in [%]<b>", MinMax = (0,(maxY *1.1)), TitleStandoff = 5 )
            |> Chart.withXAxisStyle(TitleText = "<b>Amount of Misscleavages<b>", MinMax = (0,3), TitleStandoff = 5)
            )  
            
    let gridCombination = 
        let nRows = 
            System.Math.Ceiling((chartListMaxY.Length |> float) / 4.)
        chartListMaxY
        |> Chart.Grid ((nRows |> int),6, Pattern = StyleParam.LayoutGridPattern.Coupled, XGap = 0.2, YGap = 0.3)

    let createResultFolderMis = 
        System.IO.Directory.CreateDirectory ((String.concat "" [|"./arc/runs"; directoryName; "/Results/Misscleavages"|]))
    let stylingChart = 
        gridCombination
        |> Chart.withSize (2200,1900)
        |> Chart.withMarginSize(200,150,150,10)
        |> fun x -> 
            x |> Chart.saveHtml (String.concat "" [| "./arc/runs" ;directoryName;"/Results/Misscleavages/Misscleavages" |])
    stylingChart 
finalChartHisto 
