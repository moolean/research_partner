# Security Updates

## 2026-01-29 - Dependency Security Patches

### Critical Security Updates Applied

#### Backend Dependencies (Python)

1. **fastapi** - Updated from 0.109.0 to 0.109.1
   - **Vulnerability**: Content-Type Header ReDoS
   - **Severity**: High
   - **Impact**: Denial of Service through regex exploitation
   - **Fix**: Updated to patched version 0.109.1

2. **python-multipart** - Updated from 0.0.6 to 0.0.22
   - **Vulnerabilities Fixed**:
     - **Arbitrary File Write** (< 0.0.22): Non-default configuration could allow file writes
     - **DoS via malformed boundary** (< 0.0.18): Denial of service through deformed multipart/form-data
     - **Content-Type Header ReDoS** (<= 0.0.6): Regular expression denial of service
   - **Severity**: High/Critical
   - **Impact**: File system access, DoS attacks
   - **Fix**: Updated to patched version 0.0.22

#### Frontend Dependencies (JavaScript)

3. **pdfjs-dist** - Updated from 3.11.174 to 4.2.67
   - **Vulnerability**: Arbitrary JavaScript execution upon opening malicious PDF
   - **Severity**: Critical
   - **Impact**: XSS/RCE through crafted PDF files
   - **Fix**: Updated to patched version 4.2.67

### Verification

All dependencies have been updated to secure versions:

```bash
# Backend
pip install -r backend/requirements.txt

# Frontend
cd frontend && npm install
```

### Security Best Practices

To maintain security:

1. **Regular Updates**: Check for dependency updates monthly
2. **Vulnerability Scanning**: Use tools like `pip-audit` and `npm audit`
3. **Dependency Pinning**: Keep exact versions in production
4. **Security Alerts**: Enable GitHub Dependabot alerts
5. **Update Policy**: Apply security patches within 24-48 hours

### Testing After Updates

Run the following tests to ensure functionality:

```bash
# Backend tests
cd backend
python -m pytest tests/

# Frontend tests
cd frontend
npm test

# Integration tests
docker-compose up --build
# Test file upload, ArXiv fetch, and chat functionality
```

### Future Security Monitoring

Set up automated security scanning:

```yaml
# .github/workflows/security.yml
name: Security Scan
on: [push, pull_request]
jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run pip-audit
        run: |
          pip install pip-audit
          pip-audit -r backend/requirements.txt
      - name: Run npm audit
        run: |
          cd frontend
          npm audit --audit-level=high
```

### References

- [CVE Database](https://cve.mitre.org/)
- [GitHub Advisory Database](https://github.com/advisories)
- [OWASP Dependency Check](https://owasp.org/www-project-dependency-check/)

---

**Status**: All known vulnerabilities patched ✅  
**Last Updated**: 2026-01-29  
**Next Review**: 2026-02-29
