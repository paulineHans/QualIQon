#r "nuget: ProteomIQon, 0.0.10"
#r "nuget: FSharpAux, 2.0.0"
#r "nuget: FSharpAux.IO, 2.0.0"
#r "nuget: Plotly.NET, 5.0.0"
#r "nuget: Plotly.NET.Interactive, 5.0.0"
#r "nuget: FSharp.Stats.Interactive, 0.5.1-preview.2"
#r "nuget: Plotly.NET.ImageExport, 6.1.0"

open ProteomIQon.Dto
open FSharpAux
open FSharpAux.IO
open FSharp.Stats.Interactive
open Plotly.NET
open Plotly.NET.Interactive
open Plotly.NET.ConfigObjects
open Plotly.NET.TraceObjects
open Plotly.NET.LayoutObjects
open Giraffe.ViewEngine.HtmlElements
open FSharpAux.IO.SchemaReader.Attribute
open Plotly.NET.ImageExport
open System


let customCulture: Globalization.CultureInfo = System.Threading.Thread.CurrentThread.CurrentCulture.Clone() :?> Globalization.CultureInfo
customCulture.NumberFormat.NumberDecimalSeparator <- "."
System.Threading.Thread.CurrentThread.CurrentCulture <- customCulture

type QuantificationResult = {
        [<FieldAttribute(0)>]
        StringSequence                              : string
        [<FieldAttribute(1)>]
        GlobalMod                                   : int
        [<FieldAttribute(2)>]
        Charge                                      : int
        [<FieldAttribute(3)>]
        PepSequenceID                               : int
        [<FieldAttribute(4)>]
        ModSequenceID                               : int
        [<FieldAttribute(5)>]
        PrecursorMZ                                 : float
        [<FieldAttribute(6)>]
        MeasuredMass                                : float 
        [<FieldAttribute(7)>]
        TheoMass                                    : float
        [<FieldAttribute(8)>]
        AbsDeltaMass                                : float
        [<FieldAttribute(9)>]
        MeanPercolatorScore                         : float
        [<FieldAttribute(10)>]
        QValue                                      : float
        [<FieldAttribute(11)>]
        PEPValue                                    : float
        [<FieldAttribute(12)>]
        ProteinNames                                : string
        [<FieldAttribute(13)>]
        QuantMz_Light                               : float
        [<FieldAttribute(14)>]
        Quant_Light                                 : float
        [<FieldAttribute(15)>]
        MeasuredApex_Light                          : float 
        [<FieldAttribute(16)>]
        Seo_Light                                   : float
        [<FieldAttribute(17)>][<TraceConverter>]
        Params_Light                                : float []
        [<FieldAttribute(18)>]
        Difference_SearchRT_FittedRT_Light          : float
        [<FieldAttribute(19)>]
        KLDiv_Observed_Theoretical_Light            : float
        [<FieldAttribute(20)>]
        KLDiv_CorrectedObserved_Theoretical_Light   : float
        [<FieldAttribute(21)>]
        QuantMz_Heavy                               : float
        [<FieldAttribute(22)>]
        Quant_Heavy                                 : float
        [<FieldAttribute(23)>]
        MeasuredApex_Heavy                          : float
        [<FieldAttribute(24)>]
        Seo_Heavy                                   : float
        [<FieldAttribute(25)>][<TraceConverter>]
        Params_Heavy                                : float []        
        [<FieldAttribute(26)>]
        Difference_SearchRT_FittedRT_Heavy          : float
        [<FieldAttribute(27)>]
        KLDiv_Observed_Theoretical_Heavy            : float
        [<FieldAttribute(28)>]
        KLDiv_CorrectedObserved_Theoretical_Heavy   : float
        [<FieldAttribute(29)>]
        Correlation_Light_Heavy                     : float
        [<FieldAttribute(30)>][<QuantSourceConverter>]
        QuantificationSource                        : QuantificationSource
        [<FieldAttribute(31)>][<TraceConverter>]
        IsotopicPatternMz_Light                     : float []
        [<FieldAttribute(32)>][<TraceConverter>]
        IsotopicPatternIntensity_Observed_Light     : float []
        [<FieldAttribute(33)>][<TraceConverter>]
        IsotopicPatternIntensity_Corrected_Light    : float []
        [<FieldAttribute(34)>][<TraceConverter>]
        RtTrace_Light                               : float []
        [<FieldAttribute(35)>][<TraceConverter>]
        IntensityTrace_Observed_Light               : float []
        [<FieldAttribute(36)>][<TraceConverter>]
        IntensityTrace_Corrected_Light              : float []
        [<FieldAttribute(37)>][<TraceConverter>]
        IsotopicPatternMz_Heavy                     : float []
        [<FieldAttribute(38)>][<TraceConverter>]
        IsotopicPatternIntensity_Observed_Heavy     : float []
        [<FieldAttribute(39)>][<TraceConverter>]
        IsotopicPatternIntensity_Corrected_Heavy    : float []
        [<FieldAttribute(40)>][<TraceConverter>]
        RtTrace_Heavy                               : float []
        [<FieldAttribute(41)>][<TraceConverter>]
        IntensityTrace_Observed_Heavy               : float []
        [<FieldAttribute(42)>][<TraceConverter>]
        IntensityTrace_Corrected_Heavy              : float []
        [<FieldAttribute(43)>]
        AlignmentScore                              : float
        [<FieldAttribute(44)>]
        AlignmentQValue                             : float
        }

type Parameters = 
    {
        R: float 
    }
let layout = 
    let axsisLayout () =
        LinearAxis.init (
            // Ticks = StyleParam.TickOptions.Inside,
            ShowLine = true,
            ZeroLine = false,
            TickLabelStep = 1,
            ShowTickLabels = true,
            Mirror = StyleParam.Mirror.All,
            TickFont = (Font.init (Size = 18))
        )
    let majorLayout =    
        Layout.init (
            Title = 
                Title.init(
                    Text ="<b>Correlation_Light_Heavy Parameter Visualization in % of <i>Chlamydomonas reinhardtii<i><b>", 
                    XAnchor = StyleParam.XAnchorPosition.Center, 
                    Font = (Font.init (Family = StyleParam.FontFamily.Arial, Size= 30, Color = Color.fromString "Black"))
            ),
            Font = (Font.init (Family = StyleParam.FontFamily.Arial, Size= 26, Color = Color.fromString "Black"))
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
//calculation and parameters that are needed
let histogram (data : (string * Parameters array) array) = 
    //files down below 
    let dataCorr = data |> Array.map (fun x -> snd x)
    let correlation = dataCorr 

    //bandwidth calculation
    let bandWidthCalculation = 
        let createBandWidth = 
            correlation
            |> Array.map (fun x -> 
                x
                |> Array.map (fun y -> 
                    y.R 
                )
                |> FSharp.Stats.Distributions.Frequency.create 0.05
                |> Map.toArray
            )
        //% calculation
        let percentages = 
            let sum = 
                createBandWidth
                |> Array.map (fun x -> 
                    let calculateSum =                    
                        x
                        |> Array.sumBy snd
                        |> float
                    let getSingleCount = 
                        x
                        |> Array.map (fun (x,y) -> (x, (y |> float) / calculateSum))
                    getSingleCount
                )       
            sum 
        //file Names 
        let getFiles = data |> Array.map (fun x -> (fst x ).Split("TM").[1]) 
        
        //creating Chart
        let createChart = 
            percentages
            |> Array.map2 (fun y x  -> 
                let building = 
                    Chart.Column (
                    keysValues = x,
                    MarkerColor = Color.fromHex("#FFA252")
                    )
                    |> Chart.withTraceInfo (ShowLegend = false)
                    |> Chart.withYAxisStyle(MinMax= (0,0.57), TitleText = "<b>Correlation in %<b>", TitleFont = (Font.init (Family = StyleParam.FontFamily.Arial, Size= 22, Color = Color.fromString "Black")), TitleStandoff = 5, Side = StyleParam.Side.Left)
                    |> Chart.withXAxisStyle (TitleText = "<b>Correlation_Light_Heavy<b>", TitleFont = (Font.init (Family = StyleParam.FontFamily.Arial, Size= 22, Color = Color.fromString "Black")), TitleStandoff = 5, Side = StyleParam.Side.Bottom)  
                building, y
            ) getFiles 
        createChart
    bandWidthCalculation
histogram

//adapter function 
let proteomIQonToParams (path: string) = 
    let fileNames = System.IO.Path.GetFileNameWithoutExtension path
    let files = 
        FSharpAux.IO.SchemaReader.Csv.CsvReader<QuantificationResult>().ReadFile(path, '\t', false, 1)
        |> Seq.toArray
        |> Array.map (fun x -> 
            { 
                R = x.Correlation_Light_Heavy
            }
        )
    (fileNames,files |> Seq.toArray)

// read-in files
let finalHistoCorrelation (directoryName: string) =
    let directorypath_Correlation = (String.concat "" [| "./arc/runs/"; directoryName; "/quant" |])
    let allData_Correlation  = System.IO.Directory.GetFiles (directorypath_Correlation, "*.quant")
    let paramsArray = 
        allData_Correlation
        |> Array.map proteomIQonToParams
        |> Array.sort
    let execution_Correlation = paramsArray |> histogram
    
    //folder for CWL 
    let createResultsFolderCorr = 
        System.IO.Directory.CreateDirectory ((String.concat "" [|"./arc/runs/"; directoryName; "/Results/Correlation"|]))

    //styling 
    let stylingChart = 
        // calculation of the needed amount of Cols and Rows
        let gridCalculation = 
            System.Math.Ceiling ((execution_Correlation.Length |> float) / 4.)
        
        let fining = 
            execution_Correlation
                |> Array.unzip 
                |> fun (x,y ) -> 
                    x
                    |> Chart.Grid (nRows =  (gridCalculation |> int), nCols = 6, Pattern = StyleParam.LayoutGridPattern.Coupled)
                    |> Chart.withMarginSize (250, 200, 150, 100)
                    |> Chart.withTemplate layout 
                    |> Chart.withSize (2200,1900)
            |> fun (x: GenericChart) -> 
                x 
                |> Chart.saveHtml (String.concat "" [| "./arc/runs/"; directoryName; "/Results/Correlation/PointDensityCorrelation" |])
        fining
    stylingChart
finalHistoCorrelation 


//Chart with description other method if needed 