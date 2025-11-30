# Advanced Authentication Service (Node.js + TypeScript + Clean Architecture)

A production-ready **authentication microservice** built with TypeScript, Node.js, MongoDB, and clean architecture principles.  
This project demonstrates real-world backend engineering practices, including token rotation, OAuth2, validation layers, logging, and modular design.

---

## Features

### **Authentication**
- JWT Access Tokens
- **Refresh Token Rotation** (replay-attack protection)
- Google OAuth2 Login
- Secure cookie handling

### **Architecture**
- Clean layered structure:
  - **controllers/**
  - **services/**
  - **models/**
  - **middlewares/**
  - **dtos/**
  - **types/**
  - **utils/**
  - **config/**
  - **routes/**
  - **errors/**
- DTO layer for clean request/response handling
- Strongly typed Express request extensions
- Environment config loader with validation

### **Validation & Error Handling**
- Zod validation layer
- Centralized error middleware
- Custom `ApiError` class
- 100% consistent error responses

### **Logging**
- Pino logger
- HTTP request logging middleware
- Production-friendly log format

### **Database**
- MongoDB (Mongoose)
- User model
- OAuth Account model
- Refresh Token model

---

## Project Structure

