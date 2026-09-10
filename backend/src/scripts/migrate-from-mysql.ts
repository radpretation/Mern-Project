import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import {
  User,
  Role,
  ComplianceService,
  TestingService,
  CustomerProcess,
  SubCustomerAssignment,
  Questionnaire,
  ComplianceProject,
  TestingProject,
  EvidenceReview,
  EvidenceDocument,
  AssessorDocument,
  AuditComment,
  ComplianceReport,
  ArchivedProcess,
  Country,
  CmsPage,
} from '../models';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/panaceainfosec';
const SQL_FILE_PATH = path.resolve(__dirname, '../../../database/panaceainfosec_full.sql');
const UPLOADS_ROOT = path.resolve(__dirname, '../../../uploads');

function getChecksum(filePath: string): string {
  if (fs.existsSync(filePath)) {
    const fileBuffer = fs.readFileSync(filePath);
    return crypto.createHash('sha256').update(fileBuffer).digest('hex');
  }
  return '';
}

function parseSqlValues(sqlContent: string, tableName: string): any[][] {
  const tableRegex = new RegExp(`INSERT INTO \`${tableName}\` VALUES\\s*`, 'gi');
  const allRows: any[][] = [];
  let match: RegExpExecArray | null;

  while ((match = tableRegex.exec(sqlContent)) !== null) {
    const startIndex = match.index + match[0].length;
    let inString = false;
    let quoteChar = '';
    let escape = false;
    let endIndex = startIndex;

    for (let i = startIndex; i < sqlContent.length; i++) {
      const ch = sqlContent[i];
      if (escape) {
        escape = false;
        continue;
      }
      if (ch === '\\') {
        escape = true;
        continue;
      }
      if ((ch === "'" || ch === '"') && !inString) {
        inString = true;
        quoteChar = ch;
        continue;
      }
      if (ch === quoteChar && inString) {
        inString = false;
        quoteChar = '';
        continue;
      }
      if (ch === ';' && !inString) {
        endIndex = i;
        break;
      }
    }

    const valuesString = sqlContent.slice(startIndex, endIndex).trim();

    let inTuple = false;
    let inTupleString = false;
    let tupleQuoteChar = '';
    let tupleEscape = false;
    let currentVal = '';
    let currentRow: any[] = [];

    for (let i = 0; i < valuesString.length; i++) {
      const ch = valuesString[i];

      if (tupleEscape) {
        currentVal += ch;
        tupleEscape = false;
        continue;
      }
      if (ch === '\\') {
        currentVal += ch;
        tupleEscape = true;
        continue;
      }
      if ((ch === "'" || ch === '"') && !inTupleString) {
        inTupleString = true;
        tupleQuoteChar = ch;
        currentVal += ch;
        continue;
      }
      if (ch === tupleQuoteChar && inTupleString) {
        inTupleString = false;
        tupleQuoteChar = '';
        currentVal += ch;
        continue;
      }
      if (inTupleString) {
        currentVal += ch;
        continue;
      }

      if (ch === '(' && !inTuple) {
        inTuple = true;
        currentRow = [];
        currentVal = '';
        continue;
      }
      if (ch === ',' && inTuple) {
        currentRow.push(cleanSqlValue(currentVal.trim()));
        currentVal = '';
        continue;
      }
      if (ch === ')' && inTuple) {
        currentRow.push(cleanSqlValue(currentVal.trim()));
        allRows.push(currentRow);
        inTuple = false;
        currentVal = '';
        continue;
      }
      if (inTuple) {
        currentVal += ch;
      }
    }
  }

  return allRows;
}

function cleanSqlValue(val: string): any {
  if (val === 'NULL' || val === 'null' || val === '') return null;
  if ((val.startsWith("'") && val.endsWith("'")) || (val.startsWith('"') && val.endsWith('"'))) {
    return val
      .slice(1, -1)
      .replace(/\\'/g, "'")
      .replace(/\\"/g, '"')
      .replace(/\\r/g, '\r')
      .replace(/\\n/g, '\n')
      .replace(/\\\\/g, '\\');
  }
  if (!isNaN(Number(val)) && val !== '') return Number(val);
  return val;
}

export async function runMigration() {
  console.log(`Connecting to MongoDB at: ${MONGODB_URI}`);
  await mongoose.connect(MONGODB_URI);
  console.log('MongoDB connected.');

  if (!fs.existsSync(SQL_FILE_PATH)) {
    console.error(`SQL dump not found at ${SQL_FILE_PATH}`);
    process.exit(1);
  }

  console.log('Reading SQL dump...');
  const sqlContent = fs.readFileSync(SQL_FILE_PATH, 'utf-8');

  // In-memory maps for legacy ID resolution
  const userMap = new Map<number, mongoose.Types.ObjectId>();
  const processMap = new Map<number, mongoose.Types.ObjectId>();
  const questionMap = new Map<number, mongoose.Types.ObjectId>();

  // 1. Roles
  console.log('Migrating Roles...');
  const roleRows = parseSqlValues(sqlContent, 'roles');
  for (const r of roleRows) {
    // id, role_name, status, created_at, updated_at
    const legacyId = r[0];
    const roleName = r[1];
    const status = r[2] || 'active';
    await Role.findOneAndUpdate(
      { legacyId },
      { legacyId, roleName, status },
      { upsert: true, new: true }
    );
  }

  // 2. Services (Compliance)
  console.log('Migrating Compliance Services...');
  const serviceRows = parseSqlValues(sqlContent, 'services');
  for (const s of serviceRows) {
    // id, service_name, status, fetch_id, created
    const legacyId = s[0];
    const serviceName = s[1];
    const status = s[2] ?? 1;
    const fetchId = s[3] ?? 0;
    await ComplianceService.findOneAndUpdate(
      { legacyId },
      { legacyId, serviceName, status, fetchId },
      { upsert: true, new: true }
    );
  }

  // 3. Testing Services
  console.log('Migrating Testing Services...');
  const testingRows = parseSqlValues(sqlContent, 'testing');
  for (const t of testingRows) {
    // id, testing_name, status, created_date, updated
    const legacyId = t[0];
    const testingName = t[1];
    const status = t[2] ?? 0;
    await TestingService.findOneAndUpdate(
      { legacyId },
      { legacyId, testingName, status },
      { upsert: true, new: true }
    );
  }

  // 4. Users
  console.log('Migrating Users...');
  const userRows = parseSqlValues(sqlContent, 'users');
  for (const u of userRows) {
    // id, parent_id, full_name, email, phone_number, password, company_name, company_number, address, status, user_type, certificate_key, new_certificate_key, is_certificate_verified, unique_id, created_date, updated_date, last_login, permission, pwdstring
    const legacyId = u[0];
    const legacyParentId = u[1] || 0;
    const fullName = u[2] || '';
    const email = u[3] ? u[3].toLowerCase().trim() : `user_${legacyId}@placeholder.com`;
    const phoneNumber = u[4] || '';
    const legacyMd5 = u[5] || '';
    const companyName = u[6] || '';
    const companyNumber = u[7] || '';
    const address = u[8] || '';
    const status = u[9] || 'active';
    const userType = Number(u[10]) || 5;
    const certificateKey = u[11] || '';
    const newCertificateKey = u[12] || '';
    const isCertificateVerified = Number(u[13]) || 0;
    const uniqueId = u[14] || '';
    const permissions = u[18] || '';
    const pwdString = u[19] || '';

    // Generate bcrypt hash from plaintext pwdString if present or fallback to legacy password
    const defaultPassword = String(pwdString || '123456');
    const passwordHash = await bcrypt.hash(defaultPassword, 10);

    const doc = await User.findOneAndUpdate(
      { email },
      {
        legacyId,
        legacyParentId,
        fullName,
        email,
        phoneNumber,
        passwordHash,
        legacyMd5Hash: legacyMd5,
        pwdString,
        companyName,
        companyNumber,
        address,
        status,
        userType,
        certificateKey,
        newCertificateKey,
        isCertificateVerified,
        uniqueId,
        permissions,
      },
      { upsert: true, new: true }
    );
    userMap.set(legacyId, doc._id as mongoose.Types.ObjectId);
  }

  // Update parentId references for sub-customers
  for (const [legacyId, userId] of userMap.entries()) {
    const user = await User.findById(userId);
    if (user && user.legacyParentId && user.legacyParentId > 0) {
      const parentObjectId = userMap.get(user.legacyParentId);
      if (parentObjectId) {
        user.parentId = parentObjectId;
        await user.save();
      }
    }
  }

  // 5. Customer Processes
  console.log('Migrating Customer Processes...');
  const processRows = parseSqlValues(sqlContent, 'process');
  for (const p of processRows) {
    // id, customer_id, asigned_customer_id, process_name, status, created_date, updated
    const legacyId = p[0];
    const legacyCustomerId = p[1];
    const assignedCustomerId = p[2] || '';
    const processName = p[3] || '';
    const status = Number(p[4]) || 0;
    const customerObjectId = userMap.get(legacyCustomerId);

    if (customerObjectId) {
      const procDoc = await CustomerProcess.findOneAndUpdate(
        { legacyId },
        {
          legacyId,
          customerId: customerObjectId,
          legacyCustomerId,
          assignedCustomerId,
          processName,
          status,
        },
        { upsert: true, new: true }
      );
      processMap.set(legacyId, procDoc._id as mongoose.Types.ObjectId);
    }
  }

  // 6. Questionnaires
  console.log('Migrating Questionnaires...');
  const qRows = parseSqlValues(sqlContent, 'questionnaire');
  for (const q of qRows) {
    // id, service_id, question, status, created, updated
    const legacyId = q[0];
    const serviceId = Number(q[1]) || 1;
    const question = q[2] || '';
    const status = q[3] === '2' ? '2' : '1';

    const qDoc = await Questionnaire.findOneAndUpdate(
      { legacyId },
      { legacyId, serviceId, question, status },
      { upsert: true, new: true }
    );
    questionMap.set(legacyId, qDoc._id as mongoose.Types.ObjectId);
  }

  // 7. Compliance Projects
  console.log('Migrating Compliance Projects...');
  const compRows = parseSqlValues(sqlContent, 'compliance_project');
  for (const cp of compRows) {
    // id, service_id, customer_id, process_id, qsa_id, consultant_id, qa_id, start_date, end_date, type, status, created_date, updated
    const legacyId = cp[0];
    const serviceId = Number(cp[1]) || 1;
    const legacyCustomerId = cp[2];
    const legacyProcessId = cp[3];
    const legacyQsaId = cp[4];
    const legacyConsultantId = cp[5];
    const legacyQaId = cp[6];
    const startDate = cp[7] || '';
    const endDate = cp[8] || '';
    const type = Number(cp[9]) || 1;
    const status = Number(cp[10]) || 0;

    const customerId = userMap.get(legacyCustomerId);
    const processId = processMap.get(legacyProcessId);
    const qsaId = userMap.get(legacyQsaId);
    const consultantId = userMap.get(legacyConsultantId);
    const qaId = userMap.get(legacyQaId);

    if (customerId && processId && qsaId && consultantId && qaId) {
      await ComplianceProject.findOneAndUpdate(
        { legacyId },
        {
          legacyId,
          serviceId,
          customerId,
          legacyCustomerId,
          processId,
          legacyProcessId,
          qsaId,
          legacyQsaId,
          consultantId,
          legacyConsultantId,
          qaId,
          legacyQaId,
          startDate,
          endDate,
          type,
          status,
        },
        { upsert: true, new: true }
      );
    }
  }

  // 8. Testing Projects
  console.log('Migrating Testing Projects...');
  const tpRows = parseSqlValues(sqlContent, 'testing_project');
  for (const tp of tpRows) {
    // id, testing_id, customer_id, process_id, qsa_id, consultant_id, qa_id, start_date, end_date, status, created_date, updated
    const legacyId = tp[0];
    const testingId = Number(tp[1]) || 1;
    const legacyCustomerId = tp[2];
    const legacyProcessId = tp[3];
    const legacyQsaId = tp[4];
    const legacyConsultantId = tp[5];
    const legacyQaId = tp[6];
    const startDate = tp[7] || '';
    const endDate = tp[8] || '';
    const status = Number(tp[9]) || 0;

    const customerId = userMap.get(legacyCustomerId);
    const processId = processMap.get(legacyProcessId);
    const qsaId = userMap.get(legacyQsaId);
    const consultantId = userMap.get(legacyConsultantId);
    const qaId = userMap.get(legacyQaId);

    if (customerId && processId && qsaId && consultantId && qaId) {
      await TestingProject.findOneAndUpdate(
        { legacyId },
        {
          legacyId,
          testingId,
          customerId,
          legacyCustomerId,
          processId,
          legacyProcessId,
          qsaId,
          legacyQsaId,
          consultantId,
          legacyConsultantId,
          qaId,
          legacyQaId,
          startDate,
          endDate,
          status,
        },
        { upsert: true, new: true }
      );
    }
  }

  // 9. Evidence Reviews (`uplaod_evidence`)
  console.log('Migrating Evidence Reviews...');
  const evRows = parseSqlValues(sqlContent, 'uplaod_evidence');
  for (const ev of evRows) {
    const legacyId = ev[0];
    const legacyQuestionnaireId = ev[1];
    const legacyProcessId = ev[2];
    const serviceId = Number(ev[3]) || 1;
    const legacyParentId = ev[4] || 0;
    const legacyCustomerId = ev[5];
    const firstStatus = Number(ev[6]) || 0;
    const questCheckedVal = ev[7] || 'on';
    const status = Number(ev[9]) || 0;
    const legacyQsaId = ev[10];
    const qaStatus = Number(ev[11]) || 0;
    const legacyQaId = ev[13];
    const consultantStatus = Number(ev[14]) || 0;
    const consultantStatusDate = ev[15] || '';
    const legacyConsultantId = ev[16];
    const cusModification = Number(ev[17]) || 0;
    const qsaModification = Number(ev[19]) || 0;
    const qsaDate = ev[20] || '';
    const qaModification = Number(ev[21]) || 0;
    const cusaltantModification = Number(ev[23]) || 0;
    const cunsaltantDate = ev[24] || '';
    const adminCustomer = Number(ev[25]) || 0;
    const adminCustomerDate = ev[26] || '';
    const adminQa = Number(ev[27]) || 0;
    const adminQsa = Number(ev[29]) || 0;
    const adminQsaDate = ev[30] || '';
    const adminCusaltant = Number(ev[31]) || 0;
    const allStatus = Number(ev[33]) || 0;
    const adminStatus = Number(ev[34]) || 0;
    const customerDate = ev[36] || '';

    const questionnaireId = questionMap.get(legacyQuestionnaireId);
    const processId = processMap.get(legacyProcessId);
    const customerId = userMap.get(legacyCustomerId);

    if (questionnaireId && processId && customerId) {
      await EvidenceReview.findOneAndUpdate(
        { legacyId },
        {
          legacyId,
          questionnaireId,
          legacyQuestionnaireId,
          processId,
          legacyProcessId,
          serviceId,
          parentId: userMap.get(legacyParentId),
          legacyParentId,
          customerId,
          legacyCustomerId,
          firstStatus,
          questCheckedVal,
          status,
          qsaId: userMap.get(legacyQsaId),
          legacyQsaId,
          qaStatus,
          qaId: userMap.get(legacyQaId),
          legacyQaId,
          consultantStatus,
          consultantStatusDate,
          consultantId: userMap.get(legacyConsultantId),
          legacyConsultantId,
          cusModification,
          qsaModification,
          qsaDate,
          qaModification,
          cusaltantModification,
          cunsaltantDate,
          adminCustomer,
          adminCustomerDate,
          adminQa,
          adminQsa,
          adminQsaDate,
          adminCusaltant,
          allStatus,
          adminStatus,
          customerDate,
        },
        { upsert: true, new: true }
      );
    }
  }

  // 10. Evidence Documents (`uplaod_evidence_docs`)
  console.log('Migrating Evidence Documents...');
  const docRows = parseSqlValues(sqlContent, 'uplaod_evidence_docs');
  for (const d of docRows) {
    const legacyId = d[0];
    const legacyQuestionnaireId = d[1];
    const serviceId = Number(d[2]) || 1;
    const legacyProcessId = d[3];
    const legacyParentId = d[4] || 0;
    const legacyCustomerId = d[5];
    const docs = d[6];

    const questionnaireId = questionMap.get(legacyQuestionnaireId);
    const processId = processMap.get(legacyProcessId);
    const customerId = userMap.get(legacyCustomerId);

    if (questionnaireId && processId && customerId && docs) {
      const filePath = path.join(UPLOADS_ROOT, 'evidence', docs);
      const sha256Checksum = getChecksum(filePath);
      await EvidenceDocument.findOneAndUpdate(
        { legacyId },
        {
          legacyId,
          questionnaireId,
          legacyQuestionnaireId,
          serviceId,
          processId,
          legacyProcessId,
          parentId: userMap.get(legacyParentId),
          legacyParentId,
          customerId,
          legacyCustomerId,
          docs,
          originalFilename: docs,
          sha256Checksum,
        },
        { upsert: true, new: true }
      );
    }
  }

  // 11. Assessor Documents (`common_uplaod_docs`)
  console.log('Migrating Assessor Documents...');
  const assRows = parseSqlValues(sqlContent, 'common_uplaod_docs');
  for (const a of assRows) {
    const legacyId = a[0];
    const legacyQuestionnaireId = a[1];
    const serviceId = Number(a[2]) || 1;
    const legacyProcessId = a[3];
    const legacyParentId = a[4] || 0;
    const legacyCustomerId = a[5];
    const legacyUserId = a[6];
    const docs = a[7];

    const questionnaireId = questionMap.get(legacyQuestionnaireId);
    const processId = processMap.get(legacyProcessId);
    const customerId = userMap.get(legacyCustomerId);
    const userId = userMap.get(legacyUserId) || customerId;

    if (questionnaireId && processId && customerId && docs) {
      const filePath = path.join(UPLOADS_ROOT, 'qsa', docs);
      const sha256Checksum = getChecksum(filePath);
      await AssessorDocument.findOneAndUpdate(
        { legacyId },
        {
          legacyId,
          questionnaireId,
          legacyQuestionnaireId,
          serviceId,
          processId,
          legacyProcessId,
          parentId: userMap.get(legacyParentId),
          legacyParentId,
          customerId,
          legacyCustomerId,
          userId,
          legacyUserId,
          docs,
          originalFilename: docs,
          sha256Checksum,
        },
        { upsert: true, new: true }
      );
    }
  }

  // 12. Audit Comments (`all_comments`)
  console.log('Migrating Audit Comments...');
  const commentRows = parseSqlValues(sqlContent, 'all_comments');
  for (const c of commentRows) {
    const legacyId = c[0];
    const legacyQuestionId = c[1];
    const legacyParentId = c[2] || 0;
    const legacyCustomerId = c[3];
    const serviceId = Number(c[4]) || 1;
    const legacyProcessId = c[5];
    const comments = c[6] || '';
    const legacyLoginUserId = c[7];
    const loginUserDate = c[8] ? new Date(c[8]) : new Date();

    const questionId = questionMap.get(legacyQuestionId);
    const processId = processMap.get(legacyProcessId);
    const customerId = userMap.get(legacyCustomerId);
    const loginUserId = userMap.get(legacyLoginUserId) || customerId;

    if (questionId && processId && customerId && loginUserId) {
      await AuditComment.findOneAndUpdate(
        { legacyId },
        {
          legacyId,
          questionId,
          legacyQuestionId,
          serviceId,
          processId,
          legacyProcessId,
          parentId: userMap.get(legacyParentId),
          legacyParentId,
          customerId,
          legacyCustomerId,
          loginUserId,
          legacyLoginUserId,
          comments,
          loginUserDate,
        },
        { upsert: true, new: true }
      );
    }
  }

  // 13. Reports (`report_aoc_roc`)
  console.log('Migrating Compliance Reports...');
  const repRows = parseSqlValues(sqlContent, 'report_aoc_roc');
  for (const rep of repRows) {
    const legacyId = rep[0];
    const serviceId = Number(rep[1]) || 1;
    const legacyProcessId = rep[2];
    const legacyCustomerId = rep[3];
    const legacyUserId = rep[4];
    const reportDocs = rep[5] || '';
    const reportOf = rep[6] as 'AOC' | 'ROC' | 'AOT' | 'ROT';
    const date = rep[7] || '';
    const year = Number(rep[8]) || new Date().getFullYear();

    const processId = processMap.get(legacyProcessId);
    const customerId = userMap.get(legacyCustomerId);
    const userId = userMap.get(legacyUserId) || customerId;

    if (processId && customerId && userId && reportDocs) {
      const filePath = path.join(UPLOADS_ROOT, 'report', reportDocs);
      const sha256Checksum = getChecksum(filePath);
      await ComplianceReport.findOneAndUpdate(
        { legacyId },
        {
          legacyId,
          serviceId,
          processId,
          legacyProcessId,
          customerId,
          legacyCustomerId,
          userId,
          legacyUserId,
          reportDocs,
          reportOf,
          date,
          year,
          sha256Checksum,
        },
        { upsert: true, new: true }
      );
    }
  }

  // 14. Archived Processes
  console.log('Migrating Archived Processes...');
  const arcRows = parseSqlValues(sqlContent, 'archived');
  for (const arc of arcRows) {
    const legacyId = arc[0];
    const legacyProcessId = arc[1];
    const processId = processMap.get(legacyProcessId);
    if (processId) {
      await ArchivedProcess.findOneAndUpdate(
        { legacyId },
        { legacyId, processId, legacyProcessId },
        { upsert: true, new: true }
      );
    }
  }

  console.log('✅ Migration from MySQL to MongoDB completed successfully!');
  await mongoose.disconnect();
}

if (require.main === module) {
  runMigration().catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
  });
}
