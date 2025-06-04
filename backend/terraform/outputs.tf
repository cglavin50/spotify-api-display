# provides named outputs that we can use
output "website_bucket_name" {
  description = "Name of the S3 bucket hosting the website"
  value       = aws_s3_bucket.website.bucket
}

output "website_url" {
  description = "URL of the static website"
  value       = aws_s3_bucket_website_configuration.website_config.website_endpoint
}

output "website_domain" {
  description = "Website domain (for CNAME records)"
  value       = aws_s3_bucket_website_configuration.website_config.website_domain
}

# output "api_gateway_url" { # since we are using $default, this won't work
#   description = "Base URL for API Gateway"
#   value       = aws_api_gateway_deployment.main.invoke_url
# }
output "api_gateway_base_url" {
  description = "Base API URL for lambda functions"
  value = aws_apigatewayv2_api.main.api_endpoint
}
#
# output "api_gateway_endpoint" {
#   description = "Full endpoint URL for items resource"
#   value       = "${aws_api_gateway_deployment.main.invoke_url}/items"
# }

# output "s3_bucket_name" {
#   description = "Name of the backend S3 bucket"
#   value       = aws_s3_bucket.app_storage.bucket
# }
#
# output "s3_bucket_arn" {
#   description = "ARN of the backend S3 bucket"
#   value       = aws_s3_bucket.app_storage.arn
# }

# output "lambda_function_name" {
#   description = "Name of the Lambda function"
#   value       = aws_lambda_function.api_handler.function_name
# }
#
# output "lambda_function_arn" {
#   description = "ARN of the Lambda function"
#   value       = aws_lambda_function.api_handler.arn
# }
