#load "../plots/Scripts//Heatmaps.fsx"

let execute_Heatmaps = 
    let args : string array =  fsi.CommandLineArgs
    printfn "%A" args
    let newArgs = args |> Array.tail 
    let createDirectory = System.IO.Directory.CreateDirectory ((String.concat "" [|"./arc/runs"; newArgs.[0]; "/Results/Heatmaps"|]))
    let labeling = newArgs.[1]
    printfn "%A" labeling
    let check = newArgs.[2]
    printfn "%A" check
    let checkExecution = 
        if labeling = "15N" then do
            Heatmaps.finalHeatmapQuantLight  newArgs.[0] newArgs.[2]
            Heatmaps.finalHeatmapQuantHeavy newArgs.[0]newArgs.[2] 
            Heatmaps.finalHeatmaRatio newArgs.[0]  newArgs.[2]
        else   Heatmaps.finalHeatmapQuantLight newArgs.[0] newArgs.[2] |> ignore
    checkExecution
execute_Heatmaps