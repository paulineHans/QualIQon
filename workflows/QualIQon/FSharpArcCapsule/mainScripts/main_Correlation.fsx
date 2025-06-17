# load "../plots/Scripts/Correlation.fsx"
let execution = 
    let args : string array = fsi.CommandLineArgs
    printfn "%A" args 
    let newargs = args |> Array.tail 
    let createDirectory = System.IO.Directory.CreateDirectory ((String.concat "" [|"./arc/runs"; newargs.[0]; "/Results/Correlation"|]))
    printfn "%A" (String.concat "" [|"./arc/runs"; args.[0]; "/Results/Correlation"|])
    let labeling  = newargs.[1]
    if labeling = "15N" then do Correlation.finalHistoCorrelation newargs.[0] else ((printfn "No diagram aviable because there is no 15N data used in the experiement"))
execution