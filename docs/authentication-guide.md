# Authentication and Authorization Guide

## Overview
The backend uses JWT-based authentication to protect user-specific resources.

## Registration
- Users register with their account details.
- Passwords are stored as bcrypt hashes.
- Responses should not expose password hashes.

## Login
- Users provide their email and password.
- Credentials are verified before login succeeds.
- A JWT token is returned after successful authentication.

## Protected Routes
- Protected endpoints require a valid JWT.
- The authenticated user's identity is used to authorize requests.
- Invalid, missing, or expired tokens are rejected.

## Authorization
- Users can access only their own profile and farms.
- Crop and field access is restricted through farm ownership.

## Security Practices
- Never expose passwords or password hashes.
- Keep JWT secrets in environment variables.
- Never commit actual environment secrets.
