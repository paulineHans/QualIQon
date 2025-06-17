#r "nuget: ProteomIQon, 0.0.10"
#r "nuget: FSharpAux, 2.0.0"
#r "nuget: FSharpAux.IO, 2.0.0"
#r "nuget: Plotly.NET, 5.0.0"
#r "nuget: Plotly.NET.Interactive, 5.0.0"
#r "nuget: Plotly.NET.ImageExport, 6.1.0"
open ProteomIQon.Dto
open FSharpAux
open FSharpAux.IO
open Plotly.NET
open Plotly.NET.Interactive
open Plotly.NET.ConfigObjects
open System.IO 
open System
open NLog
open Plotly.NET.TraceObjects
open Plotly.NET.LayoutObjects
open Giraffe.ViewEngine.HtmlElements
open Plotly.NET.ImageExport
open BioFSharp
open BioFSharp.Mz
open BioFSharp.IO

let customCulture: Globalization.CultureInfo = System.Threading.Thread.CurrentThread.CurrentCulture.Clone() :?> Globalization.CultureInfo
customCulture.NumberFormat.NumberDecimalSeparator <- "."
System.Threading.Thread.CurrentThread.CurrentCulture <- customCulture

type parameters_PSMS = 
    {
        SND: float 
        AND: float 
        SNR: int 
        SQ: float 
        L: int
        PSMID: string
 
    }
type parameters_PSM = 
    {
        QV: float
        PEP: float 
    }
let Iterations (a : string * (parameters_PSMS array)) = 
    let file = a |> fst 
    let data = a |> snd 
    let logger = ProteomIQon.Logging.createLogger (System.IO.Path.GetFileNameWithoutExtension "")
    //logger ist ein weg um zu verfolgen, was im Programm passiert. Output meistens log Datei 
    let bestPSMPerScan = 
                data
                |> Array.filter (fun x -> nan.Equals(x.SND) = false && nan.Equals(x.AND) = false )
                |> Array.groupBy (fun x -> x.SNR)
                |> Array.map (fun (psmId,psms) -> 
                    psms 
                    |> Array.maxBy (fun x -> 
                        x.SQ
                        )
                    )
     //filtert die Daten um NaNs zu entfernen; grupiert die gefilterten Daten nach ScanNr und findet die besten PSM pro Scan basierend auf SEQUEST
    let getQ = BioFSharp.Mz.FDRControl.calculateQValueStorey bestPSMPerScan (fun x -> x.SQ = -1) (fun x ->  x.SQ ) (fun x ->  x.SQ)             
    //berechnet QValue 
    let getPep =
        let bw = 
            bestPSMPerScan
            |> Array.map (fun x -> x.SQ)
            |> FSharp.Stats.Distributions.Bandwidth.nrd0
            |> fun x -> x / 4.
        ProteomIQon.PepValueCalculation.initCalculatePEPValueIRLS logger bw (fun (x: parameters_PSMS) -> x.L = -1) (fun x -> x.SQ ) (fun x -> x.SQ) bestPSMPerScan
    // berechnet PEP Value 
    let qpsm = 
        bestPSMPerScan 
        |> Array.filter (fun x -> 
            let qValPass = x.SQ|> getQ  < 0.05
            
            let pepValPass = x.SQ  |> getPep < 0.05
            printfn "%A" pepValPass
            qValPass && pepValPass

            )
        |> Array.filter (fun x -> x.L = 1)
        |> Array.map (fun x -> x.PSMID,x)
        //|> Map.ofArray
    qpsm, file
    // filtert die PSMs die einen QValue und PEP Value Wert von kleiner als 0.05 hat und die mit einem Label von 1. Map wird erstellt, die PSMIDs mit PSM Objekten verknüpft 
    // label ist target oder decoy 

//adapterfunction for MaxQuant, FragPipe & ProteomIQon
let proteomIQonToParams (path:string) =
    let fileNames =  System.IO.Path.GetFileNameWithoutExtension path
    let files =  
        FSharpAux.IO.SchemaReader.Csv.CsvReader<PeptideSpectrumMatchingResult>().ReadFile(path, '\t', false, 1)
        |> Seq.toArray
        |> Array.map (fun x -> 
            {
                SND = x.SequestNormDeltaNext
                AND = x.AndroNormDeltaNext
                SNR = x.ScanNr
                SQ = x.SequestScore
                L = x.Label
                PSMID = x.PSMId
            }
        )
    (fileNames,files |> Seq.toArray)

//read-in files 
let finalChart (directoryName: string) =
    let directoryPath = (String.concat "" [| "./arc/runs" ;directoryName;"/psm" |])
    let allData  = System.IO.Directory.GetFiles (directoryPath, "*.psm")
    let paramsArray = 
        allData 
        |> Array.map proteomIQonToParams
        |> Array.sort
    let execution = paramsArray |> Array.map Iterations
    let length = 
        execution 
        |> Array.map (fun (x, file) -> 
            file, 
            x 
            |> Array.length)
    let columnChart = 
        let chart = 
            Chart.Column (keysValues = length, MarkerColor = Color.fromHex("#FFA252"))
            |> Chart.withTraceInfo("before") 
        chart
    columnChart
finalChart 


//Q- and PepValue as Chart -> to be combined with chart before
let IterationsPsms (b : (string * parameters_PSM array) array) = 
    let kv = b |> Array.map (fun (x,y) -> x, (y |> Array.filter (fun z -> z.QV <0.05 && z.PEP <0.05) |> Array.length))
    //chart QValue/PEPvalue 
    let chart2 = 
        Chart.Column(kv, MarkerColor = Color.fromHex ("#E31B4C"))
        |> Chart.withTraceInfo("after")
    chart2

//adapterfuntion 
let proteomIQonToParams_2 (path : string) = 
    let fileNames = System.IO.Path.GetFileNameWithoutExtension path
    let files = 
        FSharpAux.IO.SchemaReader.Csv.CsvReader<PSMStatisticsResult>().ReadFile(path, '\t', false, 1)
        |> Seq.toArray 
        |> Array.map (fun x -> 
            {
                QV = x.QValue
                PEP = x.PEPValue
            }
        )
    (fileNames,files |> Seq.toArray)
//proteomIQonToParams_2 "/home/paulinehans/Dokumente/QualIQon_v1.0/runs/dilution_series/psm/20170519 TM FScon3501.psm"

//read-in files 
let readingFiles (directoryName: string) =
    let directorypath2 = (String.concat "" [| "./arc/runs" ;directoryName;"/psmstats" |])
    let allData2  = System.IO.Directory.GetFiles (directorypath2, "*.qpsm")
    let paramsArray = 
        allData2
        |> Array.map proteomIQonToParams_2
        |> Array.sort 
    let execution2 = paramsArray |> IterationsPsms
    execution2
 

//combining both charts + styling + layout 
let final_execution (directoryName : string) = 
    //combine both Charts
    let combineCharts = 
        Chart.combine [
            finalChart directoryName
            readingFiles directoryName
        ]
    
    //layout 
    let layout = 
        let axsisLayout () =
            LinearAxis.init (
            Ticks = StyleParam.TickOptions.Inside,
            ShowLine = true,
            ZeroLine = false,
            TickLabelStep = 1,
            ShowTickLabels = true,
            Mirror = StyleParam.Mirror.All,
            AutoRange = StyleParam.AutoRange.True,
            TickFont = (Font.init (Size = 20)) 
        )
        let majorLayout =    
                Layout.init (
                    Title.init(
                        Text = "<b>Targets found before and after score refinement<b>", 
                        Font = (Font.init (Family = StyleParam.FontFamily.Arial, Size= 30, Color = Color.fromString "Black")),
                        XAnchor = StyleParam.XAnchorPosition.Center,
                        AutoMargin = false),
                    Font = Font.init (Family = StyleParam.FontFamily.Arial, Size = 25, Color = Color.fromString "Black")
                    )
                |> Layout.setLinearAxis ((StyleParam.SubPlotId.XAxis 1), (axsisLayout ()))
                |> Layout.setLinearAxis ((StyleParam.SubPlotId.YAxis 1), (axsisLayout ()))

        let traceLayout = 
                [Trace2D.initScatter(
                        Trace2DStyle.Scatter(Marker = Marker.init (AutoColorScale = true)))]
            
        let templateChlamy = Template.init (majorLayout, traceLayout)
        templateChlamy
    
    //folder for CWL 
    let createResultFolderIterations = 
        System.IO.Directory.CreateDirectory ((String.concat "" [|"./arc/runs"; directoryName; "/Results/Iterations"|]))
    
    //styling combined charts 
    let styleFinalChart= 
        combineCharts    
        |> Chart.withTemplate layout    
        |> Chart.withSize (1900,1600)
        |> Chart.withMarginSize (200, 50, 150, 300)
        |> Chart.withYAxisStyle("<b>Amount of Targets<b>", TitleStandoff = 50)
        |> Chart.withXAxisStyle ("<b>Files from PSMStats Tool<b>", TitleStandoff = 50)
        |> Chart.saveHtml (String.concat "" [| "./arc/runs" ;directoryName;"/Results/Iterations/IterationsResult" |]) 
    styleFinalChart
final_execution 