terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# S3 for static site
resource "aws_s3_bucket" "website" {
  bucket = "${var.project_name}-website-${var.environment}"
  force_destroy = true # manually rewrite on each upload
}

# S3 configuring
resource "aws_s3_bucket_website_configuration" "website_config" {
  bucket = aws_s3_bucket.website.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html" # So React Router sends 404s to index.html for now
  }
}

# Public access configuration for website (allow public read). Using pre-generated URL for now
resource "aws_s3_bucket_public_access_block" "website_pab" {
  bucket = aws_s3_bucket.website.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}


# Bucket policy to allow public read access
resource "aws_s3_bucket_policy" "website_policy" {
  bucket = aws_s3_bucket.website.id
  depends_on = [aws_s3_bucket_public_access_block.website_pab]

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.website.arn}/*"
      }
    ]
  })
}

# CORS configuration to allow your website to call API Gateway
resource "aws_s3_bucket_cors_configuration" "website_cors" {
  bucket = aws_s3_bucket.website.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "POST", "PUT", "DELETE", "HEAD"]
    allowed_origins = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

# API gateway for backend. HTTP API is the new lightweight REST endpoint config
resource "aws_apigatewayv2_api" "main" {
  name = "backend-api-gateway"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_stage" "main-stage" {
  api_id = aws_apigatewayv2_api.main.id
  name = "$default" # $default stage automatically deploys and is accessible without stage-name
  auto_deploy = true
}
