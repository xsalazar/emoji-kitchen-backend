terraform {
  required_version = "~> 1.10.2"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.81.0"
    }
  }
  backend "s3" {
    bucket = "xsalazar-terraform-state"
    key    = "emoji-kitchen/terraform.tfstate"
    region = "us-west-2"
  }
}

provider "aws" {
  region = "us-west-2"
  default_tags {
    tags = {
      CreatedBy = "terraform"
    }
  }
}

output "lambda_function" {
  value = aws_lambda_function.instance.function_name
}

output "supported_emoji_api_lambda_function" {
  value = aws_lambda_function.supported_emoji_api.function_name
}

output "emoji_api_lambda_function" {
  value = aws_lambda_function.emoji_api.function_name
}
