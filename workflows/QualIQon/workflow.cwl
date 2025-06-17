cwlVersion: v1.2 
class: Workflow 
hints:
  DockerRequirement:
    dockerImageId: "devcontainer"
    dockerFile: {$include: "./Dockerfile"}
requirements:   
  - class: InitialWorkDirRequirement
    listing:
      - entryname: arc
        entry: $(inputs.arcDirectory)
        writable: true
  - class: MultipleInputFeatureRequirement
inputs: 
  arcDirectory: Directory 
  labelling: string
  directoryPath: string
  folder: string 
  pipeline: string
  FASTA: string
steps:    
  Heatmaps: 
    run: Heatmaps.cwl 
    in: 
      arcDirectory: arcDirectory
      directoryPath: directoryPath
      labelling: labelling
      pipeline: pipeline
    out: [output_Heatmaps]
  Iterations: 
    run: Iterations.cwl
    in: 
      arcDirectory: arcDirectory
      directoryPath: directoryPath
    out: [output_Iterations]
  Misscleavages: 
    run: Misscleavages.cwl
    in: 
      arcDirectory: arcDirectory
      directoryPath: directoryPath
      pipeline: pipeline
    out: [output_Misscleavages]
  Correlation: 
    run: Correlation.cwl
    in: 
      arcDirectory: arcDirectory
      directoryPath: directoryPath
      labelling: labelling
    out: [output_Correlation]
  Evidence: 
    run: Evidence.cwl 
    in: 
      arcDirectory: arcDirectory
      directoryPath: directoryPath
      FASTA: FASTA
      pipeline: pipeline
    out: [output_Evidence]
  execution: 
    run: exTool.cwl 
    in: 
      directory_array: [Heatmaps/output_Heatmaps,  Misscleavages/output_Misscleavages, Correlation/output_Correlation, Evidence/output_Evidence, Iterations/output_Iterations]
      newname: folder 
    out: [pool_directory]
outputs: 
  output_all: 
    type: Directory 
    outputSource: execution/pool_directory 


arc:has technology type:
  - class: arc:technology type
    arc:annotation value: "Docker Image"

arc:technology platform: ".NET"

arc:performer:
  - class: arc:Person
    arc:first name: "Pauline"
    arc:last name: "Hans"
    arc:email: "phans@rptu.de"
    arc:affiliation: "Rheinland-Pfälzische Technische Universität Kaiserslautern-Landau"
  
