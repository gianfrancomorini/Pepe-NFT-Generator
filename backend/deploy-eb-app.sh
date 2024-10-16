#!/bin/bash

# Set variables
APP_NAME="pepe-nft-generator"
ENV_NAME="pepe-nft-env-new-v3"
REGION="us-west-1"  # Replace with your region
VERSION_LABEL="v-$(date +%Y%m%d-%H%M%S)"
ZIP_FILE="application.zip"

# Zip the application
zip -r $ZIP_FILE . -x "*.git*" "node_modules/*"

# Create a new application version
aws elasticbeanstalk create-application-version \
    --application-name $APP_NAME \
    --version-label $VERSION_LABEL \
    --source-bundle S3Bucket="elasticbeanstalk-$REGION-$(aws sts get-caller-identity --query 'Account' --output text)",S3Key=$ZIP_FILE \
    --region $REGION

# Update the environment with the new version
aws elasticbeanstalk update-environment \
    --application-name $APP_NAME \
    --environment-name $ENV_NAME \
    --version-label $VERSION_LABEL \
    --region $REGION

echo "Deployment initiated. It may take a few minutes to complete."