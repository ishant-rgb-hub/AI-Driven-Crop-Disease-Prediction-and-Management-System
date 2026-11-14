# Backend API Reference

## Authentication
- User registration
- User login
- JWT authentication

## User Profile
- Retrieve current user profile
- Update user profile
- Protected profile endpoints

## Farm Management
- Create, retrieve, list, update and delete farms
- Restrict farm access to the owning user

## Crop Management
- Create and list crops under a farm
- Retrieve, update and delete crops
- Enforce farm ownership

## Field Management
- Create and list fields under a farm
- Retrieve, update and delete fields
- Enforce farm ownership

## Security
Protected endpoints require a valid JWT token.

## Error Handling
The API returns appropriate HTTP status codes for validation,
authentication, authorization, missing records and server errors.
