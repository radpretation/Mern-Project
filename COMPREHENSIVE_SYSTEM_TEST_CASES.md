# Panacea Infosec Compliance & Security Audit Platform
## Comprehensive System Test Suite & Quality Assurance Verification Plan

---

### Document Overview
This document specifies the complete, end-to-end test cases covering every functional module, user role, business rule, security constraint, and edge case across the **Panacea Infosec MERN Stack Compliance & Audit Management System**.

---

## 📋 Table of Contents
1. [Module 1: Authentication, Authorization & RBAC](#module-1-authentication-authorization--rbac)
2. [Module 2: Super Administrator — Customer & Process Scope Management](#module-2-super-administrator--customer--process-scope-management)
3. [Module 3: Super Administrator — Security Assessors & Project Assignment Guard](#module-3-super-administrator--security-assessors--project-assignment-guard)
4. [Module 4: Super Administrator — Compliance Project Workspace & Reporting](#module-4-super-administrator--compliance-project-workspace--reporting)
5. [Module 5: Super Administrator — Questionnaire Controls & Checklist Management](#module-5-super-administrator--questionnaire-controls--checklist-management)
6. [Module 6: Customer / Client POC — Evidence Submission & Attestation](#module-6-customer--client-poc--evidence-submission--attestation)
7. [Module 7: QSA Assessor — Security Assessment & Working Papers](#module-7-qsa-assessor--security-assessment--working-papers)
8. [Module 8: QA Reviewer — Quality Assurance & Batch Approvals](#module-8-qa-reviewer--quality-assurance--batch-approvals)
9. [Module 9: Consultant — Advisory Workspace & Pre-Audit Readiness](#module-9-consultant--advisory-workspace--pre-audit-readiness)
10. [Module 10: Cross-Role Filter Tabs & Sequential Control Numbering](#module-10-cross-role-filter-tabs--sequential-control-numbering)
11. [Module 11: Security, Storage & Edge Case Validations](#module-11-security-storage--edge-case-validations)

---

## Module 1: Authentication, Authorization & RBAC

| Test Case ID | Test Scenario | Pre-conditions | Test Steps | Expected Result | Severity |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **AUTH-01** | Super Admin Login | Admin credentials exist in MongoDB | 1. Navigate to `/login`<br>2. Enter admin email and valid password<br>3. Submit form | JWT token stored in `localStorage`, user redirected to `/admin/dashboard`. | Critical |
| **AUTH-02** | Customer (POC) Login | Customer account exists | 1. Enter customer email & password<br>2. Submit form | Redirected to `/customer/dashboard`. | Critical |
| **AUTH-03** | QSA Assessor Login | QSA user exists | 1. Enter QSA email & password<br>2. Submit form | Redirected to `/qsa/dashboard`. | Critical |
| **AUTH-04** | QA Auditor Login | QA user exists | 1. Enter QA email & password<br>2. Submit form | Redirected to `/qa/dashboard`. | Critical |
| **AUTH-05** | Consultant Login | Consultant user exists | 1. Enter consultant email & password<br>2. Submit form | Redirected to `/consultant/dashboard`. | Critical |
| **AUTH-06** | Invalid Credentials | Any role | 1. Enter incorrect password or unregistered email<br>2. Submit form | Error toast: *"Invalid email or password."* Access denied. | High |
| **AUTH-07** | Deactivated / Deleted Account Login | User with `status = 'delete'` or `status = 'inactive'` | 1. Attempt login with deleted user credentials | HTTP 401 with message: *"Your account has been deactivated or removed."* | High |
| **AUTH-08** | Unauthorized Route Access | Logged in as Customer | 1. Manually type URL `http://localhost:5173/admin/customers` | Route guard blocks access and redirects to customer portal or displays 403 Forbidden. | Critical |
| **AUTH-09** | Token Expiration Handling | Active session | 1. Expire JWT token or clear token<br>2. Make an API request | API interceptor catches HTTP 401, clears local storage, and redirects to `/login`. | Medium |
| **AUTH-10** | Password Change / Profile Update | Any authenticated user | 1. Navigate to `/profile`<br>2. Enter current password & new password<br>3. Submit | Password updated; next login requires new password. | Medium |

---

## Module 2: Super Administrator — Customer & Process Scope Management

| Test Case ID | Test Scenario | Pre-conditions | Test Steps | Expected Result | Severity |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **CUST-01** | Create New Customer Organization | Admin logged in | 1. Go to **Customers Management** (`/admin/customers`)<br>2. Click **Add New Customer**<br>3. Fill Company Name, Number, Address, POC Name, Email, Phone<br>4. Submit form | New customer created in database, welcome email simulated, customer appears in table. | Critical |
| **CUST-02** | Duplicate Customer Email Validation | Customer email already exists | 1. Fill customer form with existing email<br>2. Submit | Form rejected with error: *"Email address is already in use."* | High |
| **CUST-03** | Customer Scope / Process Creation | Customer exists | 1. Click **Manage Scopes/Processes** on customer row<br>2. Enter Process Name (e.g., `Cardholder Data Environment`)<br>3. Click Add | Process added to customer under active status (`status = 0`). | Critical |
| **CUST-04** | Process Archival | Process exists | 1. Click **Archive Process**<br>2. Confirm dialog | Process moves from active list to **Archived Processes** collection (`status = 1`). | High |
| **CUST-05** | View Archived Processes | Processes archived | 1. Navigate to **Archived Processes** (`/admin/archived-processes`) | Displays historical processes with customer name, company, and archive date. | Medium |
| **CUST-06** | Reveal Customer Plaintext Password | Admin logged in | 1. Click **Reveal Password** (Eye icon)<br>2. Enter Super Admin password<br>3. Click Verify | Super Admin password verified with bcrypt; modal displays target user's plaintext password. | High |
| **CUST-07** | Reveal Password Security Check | Admin logged in | 1. Click Reveal Password<br>2. Enter incorrect Super Admin password | Modal shows error: *"Invalid Admin password."* Password not shown. | High |
| **CUST-08** | Download Customer Device Certificate | Customer exists | 1. Click **Download Certificate** (Download icon) | Downloads `certificate.txt` with formatted RSA public key string. | Medium |
| **CUST-09** | Soft Delete Customer Account | Customer exists | 1. Click Delete Customer<br>2. Confirm | Customer `status` set to `UserStatus.DELETE`. Customer disappears from active listing. | High |

---

## Module 3: Super Administrator — Security Assessors & Project Assignment Guard

| Test Case ID | Test Scenario | Pre-conditions | Test Steps | Expected Result | Severity |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **ASSR-01** | Create QSA Assessor | Admin logged in | 1. Go to **Auditors (QSA / QA / Cons)** (`/admin/assessors`)<br>2. Click **Add New Assessor**<br>3. Select Role = QSA Assessor<br>4. Fill Name, Email, Phone, Password<br>5. Submit | New QSA created with `userType = 2`. Displays with green `QSA Assessor` badge. | Critical |
| **ASSR-02** | Create QA Auditor | Admin logged in | 1. Click Add New Assessor -> Select Role = QA Auditor<br>2. Fill details & submit | Created with `userType = 3`. Displays with indigo `QA Auditor` badge. | Critical |
| **ASSR-03** | Create Compliance Consultant | Admin logged in | 1. Click Add New Assessor -> Select Role = Consultant<br>2. Fill details & submit | Created with `userType = 4`. Displays with amber `Consultant` badge. | Critical |
| **ASSR-04** | Filter Assessors by Role Tabs | Assessors created | 1. Click **QSA Assessors** tab<br>2. Click **QA Auditors** tab<br>3. Click **Consultants** tab<br>4. Click **All Assessors** | Table filters dynamically to show only the selected role designation. | Medium |
| **ASSR-05** | **Assignment Guard: Attempt Delete on Assigned Assessor** | Assessor assigned to an active Compliance/Testing project | 1. Click **Delete (Trash icon)** on the assigned assessor (e.g., `Test Consultant`) | Modal checks assignment status; displays 🛡️ **Cannot Delete Assessor** warning showing assigned project name(s); "Confirm Delete" button is hidden. | **Blocker / Critical** |
| **ASSR-06** | **Delete Unassigned Assessor** | Assessor has no project mappings | 1. Click **Delete (Trash icon)** on unassigned assessor | Modal displays confirmation dialog: *"Are you sure you want to delete [Name]?"*; clicking **Confirm Delete** removes the assessor and refreshes table. | Critical |

---

## Module 4: Super Administrator — Compliance Project Workspace & Reporting

| Test Case ID | Test Scenario | Pre-conditions | Test Steps | Expected Result | Severity |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **PROJ-01** | Create Compliance Project Mapping | Customer, Process, QSA, QA, Consultant exist | 1. Navigate to **Compliance Projects** (`/admin/compliance-projects`)<br>2. Click **New Project Assignment**<br>3. Select Framework, Customer, Scope, QSA, QA, Consultant, Dates<br>4. Submit | New project created; unique index (`serviceId + customerId + processId`) enforced. | Critical |
| **PROJ-02** | Prevent Duplicate Project Scope Mapping | Project mapping exists | 1. Attempt to create project with exact same Framework, Customer, and Scope | Backend returns HTTP 400: *"This compliance project mapping already exists."* | High |
| **PROJ-03** | Dynamic Project Progress & Approval Counter | Project has 140 questions | 1. Open Project Workspace (`/admin/compliance-projects/:id/details`)<br>2. View status badge in top header and milestone card | Live badge accurately shows e.g., `In Progress (45/140 Approved)` without hardcoded numbers. | Critical |
| **PROJ-04** | Manual Project Status Toggle | Admin logged in | 1. In Project Workspace, go to Milestone tab<br>2. Click **Mark Completed** or **Mark In Progress** | Status updates in DB and reflects across all auditor and customer dashboards. | High |
| **PROJ-05** | Record Project End Date | Admin logged in | 1. Enter Target End Date in datepicker<br>2. Click Save Date | End date recorded without erroneously forcing status to Completed. | High |
| **PROJ-06** | Upload ROC Compliance Report | Admin logged in | 1. Click **Upload ROC**<br>2. Select valid PDF file (< 50MB)<br>3. Click Upload | PDF uploaded to `uploads/report/`, report record created; ROC report becomes downloadable. | Critical |
| **PROJ-07** | Upload AOC Compliance Report | Admin logged in | 1. Click **Upload AOC**<br>2. Select valid PDF file<br>3. Click Upload | AOC report attached and made available for customer attestation. | Critical |
| **PROJ-08** | Reject Non-PDF Report Files | Admin logged in | 1. Try uploading `.exe`, `.docx`, or `.png` to ROC/AOC | Multer filter rejects file: *"Only PDF documents are allowed for ROC / AOC compliance reports."* | Medium |
| **PROJ-09** | Batch Control Status Update from Admin | Admin logged in | 1. Check multiple questions in matrix<br>2. Click **Admin Batch Approve / Disapprove** | Selected questions updated simultaneously in `EvidenceReview` collection. | High |
| **PROJ-10** | QA Modification Approval Flow | QA requested modification | 1. In question card, view QA Modification banner<br>2. Click **Accept** or **Reject** | Modification status resolved; audit trail updated. | High |
| **PROJ-11** | Customer Modification Approval Flow | Customer requested modification | 1. In question card, view Customer Modification banner<br>2. Click **Accept** or **Reject** | Scope modification resolved; audit trail updated. | High |

---

## Module 5: Super Administrator — Questionnaire Controls & Checklist Management

| Test Case ID | Test Scenario | Pre-conditions | Test Steps | Expected Result | Severity |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **QSTN-01** | View Questions by Framework | Frameworks exist | 1. Navigate to **Questionnaires / Controls** (`/admin/questionnaires`)<br>2. Switch Compliance Framework dropdown (e.g., PCI DSS, ISO 27001) | Table updates to list all control questions for the selected framework with sequential numbering. | Critical |
| **QSTN-02** | **Add New Control Question** | Admin logged in | 1. Click **`+ Add New Question`** in top header<br>2. Select Framework (e.g., `PCI DSS`)<br>3. Enter Requirement Description<br>4. Select Status = `Active`<br>5. Click **Save Question** | Next `legacyId` calculated; new control saved and immediately listed in table. | Critical |
| **QSTN-03** | In-Line Edit Question Text | Question exists | 1. Click **Edit (Pencil icon)** on question row<br>2. Modify requirement text<br>3. Click **Save (Disk icon)** | Text updated in MongoDB; toast notification: *"Question text updated."* | High |
| **QSTN-04** | Batch Question Activation | Inactive questions exist | 1. Select checkboxes for questions<br>2. Click **Activate Selected** | Questions set to `status = '1'` (Active). | Medium |
| **QSTN-05** | Batch Question Deactivation | Active questions exist | 1. Select checkboxes for questions<br>2. Click **Deactivate Selected** | Questions set to `status = '2'` (Inactive). Excluded from new projects. | Medium |

---

## Module 6: Customer / Client POC — Evidence Submission & Attestation

| Test Case ID | Test Scenario | Pre-conditions | Test Steps | Expected Result | Severity |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **POC-01** | View Assigned Audit Requirements | Customer logged in with assigned active process | 1. Go to **Dashboard** -> Click active process scope<br>2. Open **Compliance Evidence Review** (`/customer/evidence/audit-view`) | Displays full matrix of requirements with status badges, evidence uploads, assessor reviews, and comments. | Critical |
| **POC-02** | Multi-Tenant Data Isolation | Customer POC A logged in | 1. Attempt querying `/api/customer/processes/{customerB_processId}/services`<br>2. Attempt viewing another customer's audit view | Query returns 404 / empty; strictly prevents cross-tenant access to unassigned customer data. | Critical |
| **POC-03** | Single Evidence File Upload | Control in Draft / Pending state (`allStatus = 0`) | 1. Expand a control card<br>2. Choose single valid document (e.g., `policy.pdf`)<br>3. Add optional notes<br>4. Click **Submit Evidence** | File stored in `uploads/evidence/`; `EvidenceDoc` created; `questCheckedVal = 'on'` saved. | Critical |
| **POC-04** | Batch Multi-Evidence Upload (1–10 Files) | Control requirement open | 1. Choose multiple files (e.g. 5 files: PDF, DOCX, XLSX, PNG, ZIP)<br>2. Click **Submit Evidence** | Multer batch processes all files up to 10 files limit; all document records created in single request. | High |
| **POC-05** | File Format Validation & Allowed Types | Evidence upload modal open | 1. Upload valid formats: `.pdf`, `.docx`, `.xlsx`, `.csv`, `.png`, `.jpg`, `.zip`, `.rar` | All approved business & artifact file types accepted and processed cleanly. | High |
| **POC-06** | Dangerous / Disallowed File Type Rejection | Malicious user attempts uploading script | 1. Attempt uploading executable or script (`.exe`, `.bat`, `.sh`, `.php`, `.js`) | Multer fileFilter immediately rejects upload with clear format error message. | Critical |
| **POC-07** | Upload File Size Ceiling Enforcement (50MB) | Large file upload | 1. Attempt uploading a single file exceeding 50MB | Multer size limiter rejects payload with error: `File too large` / HTTP 413. | High |
| **POC-08** | Evidence Metadata & Audit Attribution | Upload completed | 1. Inspect MongoDB `evidencedocuments` collection | Document records `originalFilename`, `docs` (sanitized unique name), `fileSize`, `mimeType`, and `customerId`. | High |
| **POC-09** | Download Uploaded Evidence Artifact | Evidence exists and belongs to company | 1. Click on evidence filename link in audit matrix | File securely streamed and downloaded via `/api/files/evidence/...`. | High |
| **POC-10** | Delete Evidence in Pending / Draft State | Precondition: Control `allStatus = 0` (Pending/Draft) | 1. Click **Delete (Trash icon)** on evidence file<br>2. Confirm deletion dialog | File record removed from MongoDB and physical file unlinked from disk. | Medium |
| **POC-11** | Delete Evidence in Disapproved / Remediation State | Precondition: Control `allStatus = 2` (QSA Disapproved) or `allStatus = 5` (QA Disapproved) | 1. Click Delete on rejected evidence file<br>2. Confirm deletion | Deletion permitted so customer can remove obsolete draft and submit corrected evidence. | High |
| **POC-12** | **Integrity Guard: Prevent Evidence Deletion on QSA Approved Control** | Precondition: Control `allStatus = 1` (QSA Approved) | 1. Attempt deleting evidence on approved control via UI or API call | Request rejected with HTTP 400: *"Cannot delete evidence for a control that has already been approved by auditor."* | **Critical** |
| **POC-13** | **Integrity Guard: Prevent Evidence Deletion on QA Approved Control** | Precondition: Control `allStatus = 4` or `7` (QA Approved) | 1. Attempt deleting evidence on QA signed-off control | Request rejected with HTTP 400; audit trail and signed-off evidence preserved. | **Critical** |
| **POC-14** | **Cross-Tenant Guard: Prevent Deleting Another Customer's Evidence** | Precondition: Customer A attempts deleting Customer B's evidence ID | 1. Send DELETE `/api/customer/evidence-docs/{customerB_docId}` | Request rejected with HTTP 403: *"Unauthorized. You can only delete evidence belonging to your company."* | **Critical** |
| **POC-15** | Request Control Scope Modification | Requirement open | 1. Click **Request Modification** button on a control card | `cusModification = 1` set, `cusModificationDate` recorded, amber "Modification Requested" badge displayed. | High |
| **POC-16** | Post Evidence Clarification Comment | Requirement open | 1. In Threaded Comments section, enter clarification message<br>2. Click Send Comment | Message appended with `loginUserId`, full name, and timestamp visible to customer and auditor teams. | High |
| **POC-17** | Download Final ROC / AOC Reports (Scoped) | Admin uploaded ROC/AOC reports | 1. Navigate to **Attestation Reports** (`/customer/reports`)<br>2. Filter by Year / Process<br>3. Download ROC / AOC | Attestation reports strictly scoped to customer's own company downloaded. | Critical |

---

## Module 7: QSA Assessor — Security Assessment & Working Papers

| Test Case ID | Test Scenario | Pre-conditions | Test Steps | Expected Result | Severity |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **QSA-01** | Access QSA Assessment Matrix | QSA assigned to project | 1. Go to **QSA Dashboard** (`/qsa/dashboard`)<br>2. Click **Review Audit** for project | Opens **QSA Security Assessment Matrix** (`/qsa/audit-view`) with all customer evidence. | Critical |
| **QSA-02** | Evaluate Evidence & Approve Control | Requirement open | 1. Inspect customer evidence documents<br>2. Click **Approve (Mark Complete)** | QSA status set to Approved (`1`), overall status set to `1` (Assigned to QA Review). | Critical |
| **QSA-03** | Disapprove Control / Request Remediation | Requirement open | 1. Click **Disapprove (Reject)**<br>2. Add review note explaining remediation needed | QSA status set to Disapproved (`2`); badge shows red `QSA Disapproved`. | High |
| **QSA-04** | Mark Control Incomplete | Requirement open | 1. Click **Mark Incomplete** | Status set to `3` (`In Progress / Incomplete`). | Medium |
| **QSA-05** | Upload Assessor Working Papers / Samples | Control expanded | 1. In Assessor Workpapers section, choose sample artifacts<br>2. Click Upload Samples | Files stored under `uploads/supplementary/`; accessible to QA and Admin. | High |
| **QSA-06** | Delete Assessor Working Paper | Paper exists | 1. Click Delete on working paper item | File record deleted; list updates optimistically. | Medium |
| **QSA-07** | Request QSA Scope Modification | QSA logged in | 1. Click **Request Scope Modification** button | `qsaModification = 1` set; notified to Admin. | Medium |

---

## Module 8: QA Reviewer — Quality Assurance & Batch Approvals

| Test Case ID | Test Scenario | Pre-conditions | Test Steps | Expected Result | Severity |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **QA-01** | Open QA Verification Matrix | QA assigned to project | 1. Go to **QA Dashboard** -> Click project review | Opens `/qa/audit-view` displaying customer evidence, QSA verdict, and working papers. | Critical |
| **QA-02** | Individual Control Sign-Off | Control expanded | 1. Verify QSA sample & customer policy<br>2. Click **QA Approve** | Control status set to `4` (`QA Approved`). | Critical |
| **QA-03** | QA Disapprove Control | Control expanded | 1. Click **QA Disapprove** | Control status set to `5` (`QA Disapproved`). Returned for assessor remediation. | High |
| **QA-04** | **Batch QA Approval** | Multiple controls in QA queue | 1. Check multiple control checkboxes<br>2. Click **Batch Approve** | All selected controls set to `QA Approved (4)` simultaneously. | Critical |
| **QA-05** | **Batch QA Disapproval / Incomplete** | Controls selected | 1. Check multiple checkboxes<br>2. Click **Batch Disapprove** or **Batch Incomplete** | All selected items updated in batch; toast confirmation displayed. | High |
| **QA-06** | Request QA Scope Modification | QA logged in | 1. Click **Request QA Modification** | Sets `qaModification = 1`; routes to Super Admin approval. | Medium |

---

## Module 9: Consultant — Advisory Workspace & Pre-Audit Readiness

| Test Case ID | Test Scenario | Pre-conditions | Test Steps | Expected Result | Severity |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **CONS-01** | Open Advisory Workspace | Consultant assigned | 1. Go to **Consultant Dashboard** -> Open workspace | Opens `/consultant/audit-view` showing customer evidence readiness. | Critical |
| **CONS-02** | Update Advisory Readiness Status | Control open | 1. Review draft evidence<br>2. Click **Mark Ready (Accept)** or **Needs Work** | Updates `consultantStatus` (`1 = Ready`, `2 = Needs Work`). | High |
| **CONS-03** | Upload Guidance Artifacts | Control expanded | 1. Upload sample policy template / gap analysis notes | Uploaded and visible to client as consultant advisory guidance. | High |
| **CONS-04** | Post Advisory Recommendation | Control expanded | 1. Add comment in threaded chat | Clarification saved and visible to customer and assessor teams. | Medium |

---

## Module 10: Cross-Role Filter Tabs & Sequential Control Numbering

| Test Case ID | Test Scenario | Pre-conditions | Test Steps | Expected Result | Severity |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **FLTR-01** | **Filter: All Controls** | Audit View open (POC / QSA / QA / Consultant / Admin) | 1. Click **All Controls** tab | Displays all controls for the project with total count badge. | High |
| **FLTR-02** | **Filter: Pending Submission** | Unsubmitted controls exist | 1. Click **Pending Submission** tab | Displays only controls with `allStatus = 0` or unsubmitted status. | High |
| **FLTR-03** | **Filter: QSA Approved** | Controls approved by QSA exist | 1. Click **QSA Approved** tab | Displays only controls where `allStatus = 1`. | High |
| **FLTR-04** | **Filter: QA Approved** | Controls approved by QA exist | 1. Click **QA Approved** tab | Displays only controls where `allStatus = 4` or `allStatus = 7`. | High |
| **FLTR-05** | **Filter: Modification Requested** | Modification requests exist | 1. Click **Modification Requested** tab | Displays controls where `cusModification = 1` or `qsaModification = 1`. | High |
| **FLTR-06** | **Filter: In Progress** | In-progress controls exist | 1. Click **In Progress** tab | Displays controls where `allStatus = 3`. | Medium |
| **FLTR-07** | **Filter: Disapproved / Incomplete** | Disapproved controls exist | 1. Click **Disapproved / Incomplete** tab | Displays controls with `allStatus` in `[2, 5, 6, 8, 9]`. | High |
| **FLTR-08** | **Sequential Numbering Integrity** | Any filter tab active | 1. Filter by `QA Approved` or `Pending Submission`<br>2. Inspect number badges on questions | Each question displays its true master index (e.g., `Question 1`, `Question 4`, `Question 140`) without jumping from 100 to 1111. | **Critical** |
| **FLTR-09** | Empty Filter State | Filter with 0 matches | 1. Click a filter with 0 items | Displays clean empty state: *"No requirements found in the '[Tab Name]' filter."* | Medium |

---

## Module 11: Security, Storage & Edge Case Validations

| Test Case ID | Test Scenario | Pre-conditions | Test Steps | Expected Result | Severity |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **SEC-01** | JWT Authentication Header Injection | User logged in | 1. Inspect outgoing Axios requests in Network tab | `Authorization: Bearer <token>` header attached on all protected API calls. | Critical |
| **SEC-02** | Password Hash Salt & Verification | User created | 1. Inspect `passwordHash` field in MongoDB `users` collection | Stored as bcrypt 10-round salted hash; original password never stored in plaintext `passwordHash`. | Critical |
| **SEC-03** | File Traversal Protection | Attacker attempts path traversal | 1. Attempt requesting `/api/files/download?path=../../etc/passwd` | Path resolved strictly within sanitized base upload directory; unauthorized access rejected. | Critical |
| **SEC-04** | Upload File Size Limit Enforcement | Uploading evidence/reports | 1. Attempt uploading file > 50MB | Request rejected with HTTP 413 or Multer size limit error. | Medium |
| **SEC-05** | MongoDB Unique Compound Indices | Database initialized | 1. Query indices on `complianceprojects`, `customerprocesses`, and `users` | Indexes `{ serviceId: 1, customerId: 1, processId: 1 }` and `email` strictly prevent orphaned or duplicate records. | High |
| **SEC-06** | XSS / HTML Injection in Requirement Text | Admin creating question | 1. Input `<script>alert('xss')</script>` in question text | React JSX automatically escapes input; rendered safely as plain string text. | High |

---

### Execution Sign-Off Matrix

| Role | Tester Name | Date Executed | Status (Pass / Fail) | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Super Admin** | ____________________ | ____________ | 🔲 PASS &nbsp; 🔲 FAIL | _____________________________ |
| **Customer / POC** | ____________________ | ____________ | 🔲 PASS &nbsp; 🔲 FAIL | _____________________________ |
| **QSA Assessor** | ____________________ | ____________ | 🔲 PASS &nbsp; 🔲 FAIL | _____________________________ |
| **QA Auditor** | ____________________ | ____________ | 🔲 PASS &nbsp; 🔲 FAIL | _____________________________ |
| **Consultant** | ____________________ | ____________ | 🔲 PASS &nbsp; 🔲 FAIL | _____________________________ |
