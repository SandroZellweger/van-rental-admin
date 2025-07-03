# Security Policy

## Supported Versions

We currently support the following versions with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security vulnerability in the Van Rental Admin Dashboard, please report it responsibly.

### How to Report

1. **DO NOT** create a public GitHub issue for security vulnerabilities
2. Email us at: `security@vanrental.com` (or create a private security advisory)
3. Include as much detail as possible:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if you have one)

### What to Include

- **Vulnerability Type**: XSS, SQL Injection, CSRF, etc.
- **Affected Component**: Admin dashboard, data import, etc.
- **Severity Level**: Critical, High, Medium, Low
- **Proof of Concept**: Code snippet or detailed steps
- **Environment**: Browser, OS, version details

### Security Considerations for Admin Dashboard

#### Data Security
- **CSV Import**: Validate and sanitize all imported data
- **Google Sheets**: Ensure proper API key management
- **Local Storage**: Sensitive data should not be stored in browser storage
- **File Uploads**: Validate file types and scan for malicious content

#### Authentication & Authorization
- **Admin Access**: Implement proper authentication for production
- **API Keys**: Never expose API keys in client-side code
- **Session Management**: Implement secure session handling
- **Role-Based Access**: Different permission levels for different users

#### Input Validation
- **XSS Prevention**: Sanitize all user inputs and dynamic content
- **SQL Injection**: Use parameterized queries for database operations
- **File Upload Security**: Validate file types and scan uploads
- **Form Validation**: Both client-side and server-side validation

#### Common Attack Vectors
- **Cross-Site Scripting (XSS)**: Particularly in van descriptions and user inputs
- **Cross-Site Request Forgery (CSRF)**: Protect state-changing operations
- **Insecure Direct Object References**: Validate access to van records
- **Security Misconfiguration**: Proper server and application configuration

### Response Timeline

- **Acknowledgment**: Within 48 hours of report
- **Initial Assessment**: Within 1 week
- **Fix Development**: Depends on severity (1-30 days)
- **Release**: Security patches released as soon as possible
- **Public Disclosure**: After fix is available and deployed

### Security Best Practices for Contributors

1. **Keep Dependencies Updated**: Regular updates to prevent known vulnerabilities
2. **Input Sanitization**: Always validate and sanitize user inputs
3. **Secure Coding**: Follow OWASP guidelines for web application security
4. **Testing**: Include security testing in your testing workflow
5. **Code Review**: Security-focused code reviews for all changes

### Responsible Disclosure

We believe in responsible disclosure and will:
- Acknowledge your contribution
- Work with you to understand and fix the issue
- Credit you publicly (if desired) once the fix is released
- Not take legal action against researchers who follow this policy

### Hall of Fame

We maintain a security researchers hall of fame to recognize contributors who help keep our project secure.

## Contact

For security-related questions or concerns:
- Email: `security@vanrental.com`
- GitHub Security Advisories: Use the "Security" tab in the repository

Thank you for helping keep the Van Rental Admin Dashboard secure! 🔒
