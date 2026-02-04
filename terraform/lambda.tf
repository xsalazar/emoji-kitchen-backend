resource "aws_lambda_function" "instance" {
  function_name = "emoji-kitchen"
  filename      = "${path.module}/dummy-lambda-package/lambda.zip" // Simple hello world application
  role          = aws_iam_role.instance.arn
  handler       = "app.handler"
  runtime       = "nodejs22.x"
  timeout       = 60   // seconds
  memory_size   = 1024 // MB

  // Since CI/CD will deploy this application externally, these do not need to be tracked after creation
  lifecycle {
    ignore_changes = [
      source_code_hash,
    ]
  }
}

resource "aws_cloudwatch_log_group" "instance" {
  name              = "/aws/lambda/${aws_lambda_function.instance.function_name}"
  retention_in_days = 30 // days
}

// Lambda handler for GET /supportedEmoji
resource "aws_lambda_function" "supported_emoji_api" {
  function_name = "emoji-kitchen-supported-emoji-api"
  filename      = "${path.module}/dummy-lambda-package/lambda.zip" // Simple hello world application
  role          = aws_iam_role.instance.arn
  handler       = "app.handler"
  runtime       = "nodejs22.x"
  timeout       = 60   // seconds
  memory_size   = 1024 // MB

  // Since CI/CD will deploy this application externally, these do not need to be tracked after creation
  lifecycle {
    ignore_changes = [
      source_code_hash,
    ]
  }
}

resource "aws_cloudwatch_log_group" "supported_emoji_api_cloudwatch_log_group" {
  name              = "/aws/lambda/${aws_lambda_function.supported_emoji_api.function_name}"
  retention_in_days = 30 // days
}

// Lambda handler for GET /emoji
resource "aws_lambda_function" "emoji_api" {
  function_name = "emoji-kitchen-emoji-api"
  filename      = "${path.module}/dummy-lambda-package/lambda.zip" // Simple hello world application
  role          = aws_iam_role.instance.arn
  handler       = "app.handler"
  runtime       = "nodejs22.x"
  timeout       = 60   // seconds
  memory_size   = 1024 // MB

  // Since CI/CD will deploy this application externally, these do not need to be tracked after creation
  lifecycle {
    ignore_changes = [
      source_code_hash,
    ]
  }
}

resource "aws_cloudwatch_log_group" "emoji_api_cloudwatch_log_group" {
  name              = "/aws/lambda/${aws_lambda_function.emoji_api.function_name}"
  retention_in_days = 30 // days
}
