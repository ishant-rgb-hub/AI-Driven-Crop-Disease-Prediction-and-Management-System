# Database Schema and Relationships

## Overview
The backend uses Prisma ORM to manage database models and relationships.

## User and Farm
- A user can own multiple farms.
- Each farm belongs to a user.

## Farm and Crop
- A farm can contain multiple crops.
- Each crop belongs to a farm.

## Farm and Field
- A farm can contain multiple fields.
- Each field belongs to a farm.

## Relationships
The database schema defines the relationships between users, farms, crops, and fields.

## Referential Integrity
Foreign keys maintain relationships between records.
Configured cascade behavior controls how related records are handled when a parent record is deleted.

## Prisma
Prisma provides database queries, schema definitions, migrations, and client generation.
