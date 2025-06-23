#!/bin/bash

# Script to generate Prisma client with new models
# This script should be run after updating the Prisma schema

echo "Generating Prisma client with new models..."

# Run Prisma migration to apply schema changes
npx prisma migrate dev --name add_security_models

# Generate Prisma client
npx prisma generate

echo "Prisma client generation complete!"
