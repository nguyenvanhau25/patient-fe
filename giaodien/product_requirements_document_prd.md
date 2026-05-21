# Patient Management System - Product Requirements Document

## Overview
A comprehensive healthcare management platform supporting multiple services: Authentication, Analytics, Appointments, Doctors, Clinical Records, Patient Management, Pharmacy, and Billing.

## Target Users
- **Administrators:** Manage doctors, patients, billing, and view advanced analytics.
- **Patients/Users:** Book appointments, view medical records, manage billing accounts, and search for doctors.

## Core Features & Screens

### 1. Admin Dashboard (Analytics & Overview)
- Visual charts for patient growth and revenue.
- Quick stats: Total patients, completed transactions, today's appointments.
- Data Source: `analytics-service`.

### 2. Patient Management (Clinical & Records)
- List of patients with search and filter.
- Detailed patient view including personal info and medical history.
- Ability to create/edit medical records.
- Data Source: `patient-service`, `clinical-service`.

### 3. Doctor Directory & Appointment Booking
- Grid/List view of doctors with ratings and availability.
- Doctor detail page with reviews and schedules.
- Appointment booking flow (Select slot -> Confirm).
- Data Source: `doctor-service`, `appointment-service`.

### 4. Billing & Pharmacy
- Billing account overview and transaction history.
- Prescription list and status.
- Data Source: `billing-service`, `pharmacy-service`.

## Technical Services (Reference)
- **auth-service:** Login, Signup, Password Reset.
- **analytics-service:** Data tracking and reporting.
- **appointment-service:** Booking and status management.
- **doctor-service:** Profile and review management.
- **clinical-service:** Medical records.
- **patient-service:** Patient profiles.
- **pharmacy-service:** Medicines and prescriptions.
- **billing-service:** Accounts and transactions.
