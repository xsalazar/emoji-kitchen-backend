// We need the specific us-east-1 cert for CloudFront
data "aws_acm_certificate" "cloudfront_acm_cert" {
  provider = aws.us-east-1
  domain   = "*.emojikitchen.dev"
}

resource "aws_cloudfront_distribution" "instance" {
  enabled = true

  origin {
    domain_name = replace(aws_apigatewayv2_api.instance.api_endpoint, "https://", "")
    origin_id   = local.api_gateway_origin_id

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  // aliases = ["backend.emojikitchen.dev"]

  // Default to forward to API Gateway
  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD"] // lol
    cache_policy_id        = aws_cloudfront_cache_policy.instance.id
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = local.api_gateway_origin_id
    viewer_protocol_policy = "allow-all"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
      locations        = []
    }
  }

  viewer_certificate {
    acm_certificate_arn = data.aws_acm_certificate.cloudfront_acm_cert.arn
    ssl_support_method  = "sni-only"
  }
}

resource "aws_cloudfront_cache_policy" "instance" {
  name    = "emoji-kitchen-cloudfront-cache-policy"
  min_ttl = 86400

  parameters_in_cache_key_and_forwarded_to_origin {
    cookies_config {
      cookie_behavior = "none"
    }

    headers_config {
      header_behavior = "none"
    }

    query_strings_config {
      query_string_behavior = "whitelist"
      query_strings {
        items = ["l", "r", "q"]
      }
    }
  }
}

resource "aws_cloudfront_response_headers_policy" "instance" {
  name = "emoji-kitchen-cloudfront-response-headers-policy"

  cors_config {
    access_control_allow_credentials = false
    origin_override                  = true

    access_control_allow_headers {
      items = ["*"]
    }

    access_control_allow_methods {
      items = ["GET"]
    }

    access_control_allow_origins {
      items = ["backend.emojikitchen.dev"]
    }
  }
}
