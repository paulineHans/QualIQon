#load "../plots/Scripts//Iterations.fsx"

let execution = 
    let args : string array = fsi.CommandLineArgs
    printfn "%A" args 
    let newArgs = args |> Array.tail 
    let createDirectory = System.IO.Directory.CreateDirectory ((String.concat "" [| "./arc/runs" ;newArgs.[0];"/Results/Iterations" |]))
    Iterations.final_execution newArgs.[0]
execution 