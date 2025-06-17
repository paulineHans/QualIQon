#r "nuget: Deedle.Interactive, 3.0.0"
#r "nuget: Plotly.NET, 5.0.0"
#r "nuget: Plotly.NET.Interactive, 5.0.0"
#r "nuget: FSharp.Stats.Interactive, 0.5.1-preview.2"
#r "nuget: BioFSharp, 2.0.0-preview.3"
#r "nuget: BioFSharp.IO, 2.0.0-preview.3"
#r "nuget: Deedle, 3.0.0"
#r "nuget: ProteomIQon, 0.0.10"
#r "nuget: Plotly.NET.ImageExport, 6.1.0"
open Deedle.Interactive
open Plotly.NET.Interactive
open FSharp.Stats.Interactive
open BioFSharp
open BioFSharp.IO
open System
open System.IO
open Deedle
open FSharp.Stats
open FSharp.Stats.Signal.Outliers
open Plotly.NET
open FSharpAux
open FSharpAux.IO
open ProteomIQon.Dto
open Plotly.NET.TraceObjects
open Plotly.NET.LayoutObjects
open Giraffe.ViewEngine.HtmlElements
open Plotly.NET.ImageExport
 

let customCulture: Globalization.CultureInfo = System.Threading.Thread.CurrentThread.CurrentCulture.Clone() :?> Globalization.CultureInfo
customCulture.NumberFormat.NumberDecimalSeparator <- "."
System.Threading.Thread.CurrentThread.CurrentCulture <- customCulture

//Code für Descrition BUtton in HTML ansicht 
        // |> Chart.withDescription [
        //     div [ XmlAttribute.KeyValue("style", 
        //                 "
        //                     font-family: Arial;
        //                     font-size: 1.5rem;
        //                     padding: 2.0rem 1.5rem;
        //                     border: 0.3px solid #ccc;
        //                     border-radius: 2px;
        //                     margin: 2.5rem;  
        //                 ") 
        //         ] 
        //         [                        
        //             p [] [ str "Description" ]
                    
        //             // Initially hidden text
        //             div [ XmlAttribute.KeyValue("id", "messageDiv"); XmlAttribute.KeyValue("style", "display: none; color: black; margin-bottom: 10px; font-family: Arial; font-size: 1.2rem") ] 
        //                 [ str "The Pearson correlation (linear correlation) of the 14N data is presented here, demonstrating the degree of correlation among all MS runs. 
        //                     This correlation provides valuable insight into the quality and consistency of individual MS analyses.
        //                     A good correlation coefficient  indicates that the results are highly consistent and reproducible."
        //                     ]

        //             // Button with JavaScript onclick event (toggles text visibility)
        //             button [ 
        //                 XmlAttribute.KeyValue("style", 
        //                     "
        //                         background-color: #FFA252;
        //                         color: white;
        //                         border: none;
        //                         padding: 10px 20px;
        //                         font-size: 1.2rem;
        //                         cursor: pointer;
        //                         border-radius: 5px;
        //                     "); 
        //                 XmlAttribute.KeyValue("onclick", 
        //                     "
        //                     var msgDiv = document.getElementById('messageDiv');
        //                     if (msgDiv.style.display === 'none' || msgDiv.style.display === '') {
        //                         msgDiv.style.display = 'block';
        //                     } else {
        //                         msgDiv.style.display = 'none';
        //                     }
        //                     "
        //                 ) 
        //             ] [ str "Click for description"]
        //         ]
        //     ]


let layout = 
        let axsisLayout () =
            LinearAxis.init (
            ShowLine = true,
            ZeroLine = false,
            TickLabelStep = 1,
            ShowTickLabels = true,
            AutoRange = StyleParam.AutoRange.True,
            TickFont = (Font.init (Size = 20))  
        )
        let majorLayout =    
            Layout.init (
             Title.init(
                Text ="<b>sample vs sample correlation: 14N to 14N: <i>Chlamydomonas reinhardtii<i> quant Files<b>", 
                XAnchor = StyleParam.XAnchorPosition.Center, 
                Font = (Font.init (Family = StyleParam.FontFamily.Arial, Size= 26, Color = Color.fromString "Black")))
            )
            |> Layout.setLinearAxis ((StyleParam.SubPlotId.XAxis 1), (axsisLayout ()))
            |> Layout.setLinearAxis ((StyleParam.SubPlotId.YAxis 1), (axsisLayout ()))
        let traceLayout = 
                [Trace2D.initScatter(
                        Trace2DStyle.Scatter(Marker = Marker.init (AutoColorScale = true))
                    )
                ]
            
        let templateChlamy = Template.init (majorLayout, traceLayout)
        templateChlamy



// get QuantLight 
let quantLight (data : (string * ((string * int * bool) * float) array) array) = 
    let file = data |> Array.map (fun x -> (fst x).Split("TM").[1])
    let allData = data |> Array.map (fun x -> snd x )
    let getQuantLight = 
        allData
        |> Array.map (fun x -> 
            x
            |> Array.filter (fun x -> not (isNan(snd x)))
            |> Array.map (fun z -> fst z, log2 (snd z + 1.) 
            )
        )
    
    // calculation pearson correlation between all files 
    let getSeqForPearson  = 
        getQuantLight
        |> Array.map (fun x -> 
            getQuantLight
            |> Array.map (fun y -> 
                let intersect = 
                    Set.intersect
                        (x |> Array.map fst |> Set.ofArray)
                        (y |> Array.map fst |> Set.ofArray)
                let xfilter = 
                    x |> Array.filter (fun (x,y) -> 
                    intersect |> Set.contains x) |> Array.map snd 
                let yFilter = 
                    y|> Array.filter (fun (x,y) -> intersect |> Set.contains x) |> Array.map snd 
                Correlation.Seq.pearson yFilter xfilter
            ) 
        )
    //creating Heatmap for quant light files 
    let heatMapQL = 
        Chart.Heatmap(zData = getSeqForPearson, colNames = file, rowNames = file, ColorScale = StyleParam.Colorscale.Portland)
    let layout = 
        let axsisLayout () =
            LinearAxis.init (
            ShowLine = true,
            ZeroLine = false,
            TickLabelStep = 1,
            ShowTickLabels = true,
            AutoRange = StyleParam.AutoRange.True,
            TickFont = (Font.init (Size = 20, Family = StyleParam.FontFamily.Arial))  
        )
        let majorLayout =    
            Layout.init (
             Title.init(
                Text ="<b>sample vs sample correlation: 14N to 14N: <i>Chlamydomonas reinhardtii<i> quant Files<b>", 
                XAnchor = StyleParam.XAnchorPosition.Center, 
                Font = (Font.init (Family = StyleParam.FontFamily.Arial, Size= 30, Color = Color.fromString "Black"))
                ), 
                Font = (Font.init (Family = StyleParam.FontFamily.Arial, Size= 25, Color = Color.fromString "Black"))
            )
            |> Layout.setLinearAxis ((StyleParam.SubPlotId.XAxis 1), (axsisLayout ()))
            |> Layout.setLinearAxis ((StyleParam.SubPlotId.YAxis 1), (axsisLayout ()))
        let traceLayout = 
                [Trace2D.initScatter(
                        Trace2DStyle.Scatter(Marker = Marker.init (AutoColorScale = true))
                    )
                ]
            
        let templateChlamy = Template.init (majorLayout, traceLayout)
        templateChlamy

    //styling
    let stylingQuantLight = 
        heatMapQL 
        |> Chart.withSize(2200,2000)
        |> Chart.withTemplate layout
        |> Chart.withMarginSize (400,250,130,180)
        |> Chart.withXAxisStyle (TitleText ="<b>quant Files<b>", TitleStandoff = 20)
        |> Chart.withYAxisStyle (TitleText="<b>quant Files<b>", TitleStandoff = 10)
    stylingQuantLight
quantLight

// adapterfunction for MaxQuant, FragPipe & ProteomIQon
let proteomIQon (path: string) = 
    let fileNames = System.IO.Path.GetFileNameWithoutExtension path
    let files = 
        Deedle.Frame.ReadCsv(path,true,true,separators="\t")
    let data = 
        files 
        |> Frame.indexRowsUsing (fun x ->
            x.GetAs<string>("StringSequence"), 
            x.GetAs<int>("Charge"),
            x.GetAs<bool>("GlobalMod")    
        )
        
        |> Frame.getCol "Quant_Light"
        |> Series.observations
        |> Seq.toArray
        |> Array.map (fun (y, x) -> y, x |> float)
    fileNames, data

// let FragPipeToParams (path :string)= 
//     let fileNames = System.IO.Path.GetFileNameWithoutExtension path
//     let files = Deedle.Frame.ReadCsv (path, hasHeaders =  true,  separators = "\t")
//     let columns = 
//         files 
//         |> Frame.getCol "Intensity"
//         |> Series.values
//         |> Seq.toArray 
//         |> Array.map (fun x -> x |> float)
//     [|"Quant_Light",columns|]
// FragPipeToParams 

// let maxQuantToParams (path: string) = 
//     let fileNames = System.IO.Path.GetFileNameWithoutExtension path 
//     let files = Deedle.Frame.ReadCsv (path, hasHeaders =  true,  separators = "\t")
//     let columns = 
//         files 
//         |> Frame.getCol ("Intensity")
//         |> Set.intersectMany
//         |> Array.map (fun x -> x |> float)
//     [|"Quant_Light",columns|]

let matchingForFile (arguments: string) =  
    match arguments with 
    | "ProteomIQon" -> proteomIQon 
    | _ -> failwith "unknown Pattern"

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
    | "ProteomIQon" -> "*.quant"
    | _ -> "unknown Format"
//read-in the files 
let finalHeatmapQuantLight (directoryName: string) pipeline =
    let directorypath_QuantLight = (String.concat "" [| "./arc/runs" ;directoryName|])
    let searchpattern = matchingDirecoryPath pipeline
    let allData_QuantLight = searchFiles directorypath_QuantLight searchpattern
    let paramsArray = 
        allData_QuantLight
            |> Array.map (fun x ->  matchingForFile pipeline x)     |> Array.sort
            
    let execution = paramsArray |>  quantLight
    let createResultsFolderLight  = 
        System.IO.Directory.CreateDirectory (String.concat ""[|"./arc/runs";directoryName; "/Results/Heatmaps"|])
    
    // saving
    let saving = 
        execution
        |> fun x -> 
            x 
                |> Chart.saveHtml(String.concat "" [| "./arc/runs" ;directoryName;"/Results/Heatmaps/Heatmap_Correlation_QuantLight" |])
            
    saving
finalHeatmapQuantLight 



















//HeatMapQuantHeavy
let quantHeavy (data : (string * ((string * int * bool) * float) array) array) = 
    let file = data |> Array.map (fun x -> (fst x).Split("TM").[1])
    let allData = data |> Array.map (fun x -> snd x )
    let getQH = 
        allData
        |> Array.map (fun x -> 
            x
            |> Array.filter (fun x -> not (isNan(snd x)))
            |> Array.map (fun z -> fst z, log2 (snd z + 1.) 
            )
        )
    let getSeqForPearsonQH  = 
        getQH
        |> Array.map (fun x -> 
            getQH
            |> Array.map (fun y -> 
                let intersect = 
                    Set.intersect
                        (x |> Array.map fst |> Set.ofArray)
                        (y |> Array.map fst |> Set.ofArray)
                let xfilter = 
                    x |> Array.filter (fun (x,y) -> 
                    intersect |> Set.contains x) |> Array.map snd 
                let yFilter = 
                    y|> Array.filter (fun (x,y) -> intersect |> Set.contains x) |> Array.map snd 
                Correlation.Seq.pearson yFilter xfilter
            ) 
        )
    //Heatmap quant_heavy files
    let heatMap_Heavy= 
        Chart.Heatmap(zData = getSeqForPearsonQH, colNames = file, rowNames = file, ColorScale = StyleParam.Colorscale.Portland)
    let layout = 
        let axsisLayout () =
            LinearAxis.init (
            ShowLine = true,
            ZeroLine = false,
            TickLabelStep = 1,
            ShowTickLabels = true,
            AutoRange = StyleParam.AutoRange.True,
            TickFont = (Font.init (Size = 20, Family = StyleParam.FontFamily.Arial)) 
        )
        let majorLayout =    
            Layout.init (
             Title.init(
                Text ="<b>sample vs sample correlation: 15N to 15N: <i>Chlamydomonas reinhardtii<i> quant Files<b>", 
                XAnchor = StyleParam.XAnchorPosition.Center, 
                Font = (Font.init (Family = StyleParam.FontFamily.Arial, Size= 30, Color = Color.fromString "Black"))
                ), 
                Font = (Font.init (Family = StyleParam.FontFamily.Arial, Size= 25, Color = Color.fromString "Black"))
            )
            |> Layout.setLinearAxis ((StyleParam.SubPlotId.XAxis 1), (axsisLayout ()))
            |> Layout.setLinearAxis ((StyleParam.SubPlotId.YAxis 1), (axsisLayout ()))
        let traceLayout = 
                [Trace2D.initScatter(
                        Trace2DStyle.Scatter(Marker = Marker.init (AutoColorScale = true))
                    )
                ]
            
        let templateChlamy = Template.init (majorLayout, traceLayout)
        templateChlamy
    //styling
    let stylingQuantHeavy = 
        heatMap_Heavy 
        |> Chart.withSize(2200,2000)
        |> Chart.withTemplate layout
        //|> Chart.withLegendStyle (Title = Title.init (Text = "log2 data"),Font = (Font.init (Family = StyleParam.FontFamily.Arial, Size= 16, Color = Color.fromString "Black")), ItemSizing = StyleParam.TraceItemSizing.Constant)
        |> Chart.withMarginSize (400,250,130,180)
        |> Chart.withXAxisStyle (TitleText ="<b>quant Files<b>", TitleStandoff = 20)
        |> Chart.withYAxisStyle (TitleText="<b>quant Files<b>", TitleStandoff = 10)    
    stylingQuantHeavy

//adapterfunction for MaxQuant, FragPipe & ProteomIQon
let proteomIQonHeavy (path: string) = 
    let fileNames = System.IO.Path.GetFileNameWithoutExtension path
    let files = 
        Deedle.Frame.ReadCsv(path,true,true,separators="\t")
    let data = 
        files 
        |> Frame.indexRowsUsing (fun x -> 
            x.GetAs<string>("StringSequence"),
            x.GetAs<int>("Charge"),
            x.GetAs<bool>("GlobalMod")
        )
        |> Frame.getCol "Quant_Heavy"
        |> Series.observations
        |> Seq.toArray
        |> Array.map (fun (x,y) -> x, y |> float)
    fileNames, data

let matchingForFile_Heavy (arguments: string) =  
    match arguments with 
    | "ProteomIQon" -> proteomIQonHeavy 
    | _ -> failwith "unknown Pattern"

let rec searchFilesQH (directoryName: string) (fileName: string) : string[] =
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

let matchingDirecoryPath_heavy (sndArg : string) = 
    match sndArg with
    | "ProteomIQon" -> "*.quant"
    | _ -> "unknown Format"



//read-in all files 
let finalHeatmapQuantHeavy (directoryName: string) pipeline =
    let directorypath_QH = (String.concat "" [| "./arc/runs" ;directoryName|])
    let searchpattern = matchingDirecoryPath_heavy pipeline
    let allData_QH = searchFilesQH directorypath_QH searchpattern
    let paramsArray = 
        allData_QH
        |> Array.map (fun x ->  matchingForFile_Heavy pipeline x) 
        |> Array.sort         
    let executionQH = paramsArray |> quantHeavy
    let createResultsFolderLight  = 
        System.IO.Directory.CreateDirectory (String.concat ""[|"./arc/runs";directoryName; "/Results/Heatmaps"|])
    
    // saving
    let savingQH = 
        executionQH
        |> fun x -> 
            x 
            |> Chart.saveHtml (String.concat "" [| "./arc/runs" ;directoryName;"/Results/Heatmaps/Heatmap_Correlation_QuantHeavy" |])
            
    savingQH
finalHeatmapQuantHeavy 

    

















//Ratio 
let ratio (data : (string * ((string * int * bool) * float) array) array)= 
    let files = data |> Array.map (fun x -> (fst x).Split("TM").[1])
    let allData = data |> Array.map snd 
    let calc = 
        allData
        |> Array.map (fun x -> 
            x
            |> Array.filter (fun x -> not (isNan(snd x)))
            |> Array.map (fun z -> fst z, log2 (snd z + 1.)))
    let calcPearson = 
        calc 
        |> Array.map (fun x -> 
            calc 
            |> Array.map (fun y -> 
                let intersect = 
                    Set.intersect
                        (x |> Array.map fst |> Set.ofArray)
                        (y |> Array.map fst |> Set.ofArray)
                let xFilter = 
                    x |> Array.filter (fun (x,y ) -> 
                        intersect |> Set.contains x) |> Array.map snd
                let yFilter= 
                    y |> Array.filter (fun (x,y)-> intersect |> Set.contains x) |> Array.map snd
                Correlation.Seq.pearson yFilter xFilter))



    let heatMapR = 
        Chart.Heatmap(zData = calcPearson, colNames = files, rowNames = files, ColorScale = StyleParam.Colorscale.Portland)

    let layout = 
        let axsisLayout () =
            LinearAxis.init (
            ShowLine = true,
            ZeroLine = false,
            TickLabelStep = 1,
            ShowTickLabels = true,
            AutoRange = StyleParam.AutoRange.True,
            TickFont = (Font.init (Size = 20, Family = StyleParam.FontFamily.Arial))   
        )
        let majorLayout =    
            Layout.init (
             Title.init(
                Text ="<b>sample vs sample correlation: 14N to 15N: <i>Chlamydomonas reinhardtii<i> quant Files<b>", 
                XAnchor = StyleParam.XAnchorPosition.Center, 
                Font = (Font.init (Family = StyleParam.FontFamily.Arial, Size= 30, Color = Color.fromString "Black"))
                ),
            Font = (Font.init (Family = StyleParam.FontFamily.Arial, Size= 25, Color = Color.fromString "Black"))
            )
            |> Layout.setLinearAxis ((StyleParam.SubPlotId.XAxis 1), (axsisLayout ()))
            |> Layout.setLinearAxis ((StyleParam.SubPlotId.YAxis 1), (axsisLayout ()))
        let traceLayout = 
                [Trace2D.initScatter(
                        Trace2DStyle.Scatter(Marker = Marker.init (AutoColorScale = true))
                    )
                ]
            
        let templateChlamy = Template.init (majorLayout, traceLayout)
        templateChlamy
    //styling
    let stylingRatio = 
        heatMapR 
        |> Chart.withSize(2200,2000)
        |> Chart.withTemplate layout
        //|> Chart.withLegendStyle (Title = Title.init (Text = "log2 data"),Font = (Font.init (Family = StyleParam.FontFamily.Arial, Size= 16, Color = Color.fromString "Black")), ItemSizing = StyleParam.TraceItemSizing.Constant)
        |> Chart.withMarginSize (400,250,130,180)
        |> Chart.withXAxisStyle (TitleText ="<b>quant Files<b>", TitleStandoff = 20)
        |> Chart.withYAxisStyle (TitleText="<b>quant Files<b>", TitleStandoff = 10)
    stylingRatio
ratio

//adapterfunction for MaxQuant, FragPipe & ProteomIQon
let proteomIQonRatio (path: string) = 
    let allData = 
        let fileNamesL = System.IO.Path.GetFileNameWithoutExtension path
        let files = 
            Deedle.Frame.ReadCsv(path,true,true,separators="\t")
        let data = 
            files
            |> Frame.indexRowsUsing (fun x -> 
                x.GetAs<string>("StringSequence"),
                x.GetAs<int>("Charge"),
                x.GetAs<bool>("GlobalMod")
            )
        let extractLight: Series<string*int*bool,float> = 
            data
            |> Frame.getCol "Quant_Light"
            // |> Series.observations
            // |> Seq.toArray
            // |> Array.map (fun (x,y) -> x, y |> float)
        let extractHeavy: Series<string*int*bool,float> = 
            data 
            |> Frame.getCol "Quant_Heavy"
            // |> Series.observations
            // |> Seq.toArray
            // |> Array.map (fun (x,y) -> x, y |> float)
        let divide = 
            extractLight/extractHeavy
            |> Series.observations
            |> Seq.toArray
            |> Array.map (fun (x,y)-> x, y |> float)
        fileNamesL, divide 
    allData

let matchingForFile_Ratio (arguments: string) =  
    match arguments with 
    | "ProteomIQon" -> proteomIQonRatio 
    | _ -> failwith "unknown Pattern"

let rec searchFilesRatio (directoryName: string) (fileName: string) : string[] =
    // Get files in the current directory that match the filename.
    let currentFiles = Directory.GetFiles(directoryName,fileName )
    
    // Get all subdirectories.
    let subDirectories = Directory.GetDirectories(directoryName)
    
    // Recursively search each subdirectory.
    let subDirFiles =
        subDirectories
        |> Array.collect (fun subDir -> searchFilesRatio subDir fileName)
    
    // Combine files from the current directory and all subdirectories.
    Array.append currentFiles subDirFiles


let matchingDirecoryPath_Ratio (sndArg : string) = 
    match sndArg with
    | "ProteomIQon" -> "*.quant"
    | _ -> "unknown Format"

//read-in files
let finalHeatmaRatio (directoryName: string) pipeline =
    let directorypath_Ratio = (String.concat "" [| "./arc/runs" ;directoryName|])
    let searchpattern = matchingDirecoryPath_Ratio pipeline
    let allData_Ratio = searchFilesRatio directorypath_Ratio searchpattern
    let paramsArray = 
        allData_Ratio
        |> Array.map (fun x ->  matchingForFile_Ratio pipeline x) 
        |> Array.sort         
    let execution = paramsArray |> ratio
    let createResultsFolderLight  = 
        System.IO.Directory.CreateDirectory (String.concat ""[|"./arc/runs";directoryName; "/Results/Heatmaps"|])
    
    // saving
    let savingR = 
        execution
        |> fun x -> 
            x 
            |> Chart.saveHtml (String.concat "" [| "./arc/runs" ;directoryName;"/Results/Heatmaps/Heatmap_Correlation_Ratio" |])
    savingR
finalHeatmaRatio