resource "aws_ecr_repository" "clean_survey_api_repo" {
    name = var.ecr_repo_name
}