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
  - class: SubworkflowFeatureRequirement
inputs: 
  arcDirectory: Directory 
  directoryPath: string
  labelling: string
  FASTA: string
  folder: string
  pipeline: string
steps: 
  step1: 
    run: ../../workflows/QualIQon/workflow.cwl
    in: 
      arcDirectory: arcDirectory 
      directoryPath: directoryPath
      labelling: labelling
      FASTA: FASTA
      folder: folder
      pipeline: pipeline
    out: [output_all]
outputs: 
  output_all: 
    type: Directory 
    outputSource: step1/output_all