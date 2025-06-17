#load "../plots/Scripts/Missclevages.fsx"

let execution = 
    let args : string array = fsi.CommandLineArgs
    printfn "%A" args 
    let newArgs = args |> Array.tail 
    let createDirectory = System.IO.Directory.CreateDirectory ((String.concat "" [| "./arc/runs" ;args.[0];"/Results/Misscleavages" |]))
    Missclevages.finalChartHisto newArgs.[0] newArgs.[1]

execution