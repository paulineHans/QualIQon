#load "../plots/Scripts/EvidenceClass.fsx"

let execution = 
    let args : string array = fsi.CommandLineArgs
    printfn "%A" args 
    let newArgs = args |> Array.tail 
    let createDirectory = System.IO.Directory.CreateDirectory ((String.concat "" [| "./arc/runs" ;newArgs.[0];"/Results/Evidence" |]))
    EvidenceClass.finalChartHisto newArgs.[0] newArgs.[1] newArgs.[2]
execution