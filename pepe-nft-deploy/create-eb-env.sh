#!/bin/bash

# Set variables
APP_NAME="pepe-nft-generator"
ENV_NAME="pepe-nft-env-new-v3"
INSTANCE_TYPE="t2.micro"
REGION="us-west-1"  # Replace with your desired region

# Get the latest Node.js solution stack
SOLUTION_STACK_NAME=$(aws elasticbeanstalk list-available-solution-stacks --region $REGION | 
                      grep -i "64bit Amazon Linux 2" | 
                      grep -i "running Node.js" | 
                      sort -r | 
                      head -n 1 | 
                      awk -F'"' '{print $2}')

echo "Using solution stack: $SOLUTION_STACK_NAME"

# Create the environment
aws elasticbeanstalk create-environment \
    --application-name $APP_NAME \
    --environment-name $ENV_NAME \
    --solution-stack-name "$SOLUTION_STACK_NAME" \
    --option-settings \
        Namespace=aws:autoscaling:launchconfiguration,OptionName=IamInstanceProfile,Value=aws-elasticbeanstalk-ec2-role \
        Namespace=aws:ec2:instances,OptionName=InstanceTypes,Value=$INSTANCE_TYPE \
    --region $REGION

echo "Elastic Beanstalk environment creation initiated. It may take a few minutes to complete."