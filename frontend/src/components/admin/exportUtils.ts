import type { FeedbackRecord } from './dummyData';

/**
 * Download currently filtered feedback records as a CSV file
 */
export const exportToCSV = (records: FeedbackRecord[], filename = 'Arogya_Mandir_Feedbacks.csv') => {
  if (!records || records.length === 0) {
    alert('No records available to export.');
    return;
  }

  const headers = [
    'Sr. No.',
    'Tracking ID',
    'Date & Time',
    'Patient Name',
    'Gender',
    'Age',
    'Mobile Number',
    'Clinic Code',
    'Clinic Name',
    'Station HQ',
    'Visitor Category',
    'Overall Rating',
    'Status',
    'Grievance (Yes/No)',
    'Registration Rating',
    'Doctor Rating',
    'Pharmacy Rating',
    'Cleanliness Rating',
    'User Suggestions'
  ];

  const rows = records.map((r, idx) => [
    idx + 1,
    `"${r.trackingId || ''}"`,
    `"${r.timestamp || r.date || ''}"`,
    `"${r.patientName || ''}"`,
    `"${r.gender || ''}"`,
    r.age || '',
    `"${r.mobileNumber || ''}"`,
    `"${r.clinicCode || ''}"`,
    `"${r.clinicName || r.facilityName || ''}"`,
    `"${r.stationHq || 'Station HQ'}"`,
    `"${r.visitorType || 'ESM/Spouse'}"`,
    `"${r.responseType || r.overallRating || ''}"`,
    `"${r.status || ''}"`,
    r.isGrievance ? 'YES' : 'NO',
    `"${r.registration?.rating || ''}"`,
    `"${r.doctor?.rating || ''}"`,
    `"${r.pharmacy?.rating || ''}"`,
    `"${r.cleanliness?.rating || ''}"`,
    `"${(r.suggestions?.text || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Generate a clean printable PDF report window for filtered dataset or single record
 */
export const exportToPDF = (records: FeedbackRecord[], title = 'Arogya Mandir Feedback Analytics Report') => {
  if (!records || records.length === 0) {
    alert('No records available to generate PDF.');
    return;
  }

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Pop-up blocked. Please allow pop-ups to download PDF.');
    return;
  }

  const dateStr = new Date().toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const totalCount = records.length;
  const excellentCount = records.filter(r => {
    const val = String(r.responseType || r.overallRating);
    return val === 'Excellent Service' || val === 'Excellent';
  }).length;
  const acceptableCount = records.filter(r => {
    const val = String(r.responseType || r.overallRating);
    return val === 'Acceptable standard' || val === 'Acceptable';
  }).length;
  const grievanceCount = records.filter(r => {
    const val = String(r.responseType || r.overallRating);
    return val === 'Could Be Better' || r.isGrievance;
  }).length;
  const resolvedCount = records.filter(r => r.status === 'Resolved').length;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #fff; color: #0f172a; padding: 30px; margin: 0; }
          .header { border-bottom: 3px solid #001529; padding-bottom: 15px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
          .logo-title { font-size: 24px; font-weight: 800; color: #001529; }
          .subtitle { font-size: 13px; color: #64748b; margin-top: 4px; }
          .badge { background: #f59e0b; color: #000; padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
          .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 25px; }
          .stat-card { border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; background: #f8fafc; }
          .stat-title { font-size: 11px; color: #64748b; font-weight: 600; text-transform: uppercase; }
          .stat-val { font-size: 20px; font-weight: 800; color: #0f172a; margin-top: 4px; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 12px; }
          th { background: #001529; color: #fff; text-align: left; padding: 10px 8px; font-size: 11px; text-transform: uppercase; }
          td { padding: 9px 8px; border-bottom: 1px solid #e2e8f0; }
          tr:nth-child(even) { background: #f8fafc; }
          .res-excellent { color: #059669; font-weight: 700; }
          .res-acceptable { color: #d97706; font-weight: 700; }
          .res-better { color: #dc2626; font-weight: 700; }
          .footer { margin-top: 30px; font-size: 11px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 15px; }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom: 20px; text-align: right;">
          <button onclick="window.print()" style="background: #001529; color: #fff; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: bold;">🖨️ Print / Save as PDF</button>
        </div>
        <div class="header">
          <div>
            <div class="logo-title">Arogya Mandir Dashboard Report</div>
            <div class="subtitle">CMO Feedback & Asset Management System | Official Audit Log</div>
          </div>
          <div style="text-align: right;">
            <span class="badge">CMO Official</span>
            <div style="font-size: 11px; color: #64748b; margin-top: 6px;">Generated: ${dateStr}</div>
          </div>
        </div>

        <div class="summary-grid">
          <div class="stat-card">
            <div class="stat-title">Total Submissions</div>
            <div class="stat-val">${totalCount}</div>
          </div>
          <div class="stat-card">
            <div class="stat-title">Excellent Service</div>
            <div class="stat-val" style="color: #059669;">${excellentCount}</div>
          </div>
          <div class="stat-card">
            <div class="stat-title">Acceptable Standard</div>
            <div class="stat-val" style="color: #d97706;">${acceptableCount}</div>
          </div>
          <div class="stat-card">
            <div class="stat-title">Grievances / Better</div>
            <div class="stat-val" style="color: #dc2626;">${grievanceCount} (${resolvedCount} Resolved)</div>
          </div>
        </div>

        <h3>Filtered Feedbacks Listing</h3>
        <table>
          <thead>
            <tr>
              <th>Sr.</th>
              <th>Date</th>
              <th>Clinic Name</th>
              <th>Station HQ</th>
              <th>Visitor Type</th>
              <th>Response Score</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${records.map((r, i) => {
              const rating = String(r.responseType || r.overallRating);
              let ratingClass = 'res-acceptable';
              if (rating === 'Excellent Service' || rating === 'Excellent') ratingClass = 'res-excellent';
              if (rating === 'Could Be Better') ratingClass = 'res-better';

              return `
                <tr>
                  <td>${i + 1}</td>
                  <td>${r.timestamp || r.date || ''}</td>
                  <td><strong>${r.clinicName || r.facilityName || ''}</strong></td>
                  <td>${r.stationHq || 'Jamnagar HQ'}</td>
                  <td>${r.visitorType || 'ESM/Spouse'}</td>
                  <td class="${ratingClass}">${rating}</td>
                  <td>${r.status}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>

        <div class="footer">
          Confidential - Internal Government Telemetry Report | Arogya Mandir CMO Network
        </div>
      </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
};

/**
 * Generate a PDF for a single feedback record
 */
export const exportSingleRecordPDF = (record: FeedbackRecord) => {
  if (!record) return;

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Pop-up blocked. Please allow pop-ups to print/download PDF.');
    return;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Feedback Details - ${record.trackingId}</title>
        <style>
          body { font-family: 'Segoe UI', sans-serif; padding: 30px; color: #0f172a; }
          .header { border-bottom: 2px solid #001529; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; }
          .box { border: 1px solid #cbd5e1; border-radius: 8px; padding: 15px; background: #f8fafc; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px; }
          th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; }
          th { background: #001529; color: white; }
          .tag { display: inline-block; background: #fbbf24; color: #000; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h2 style="margin:0;">Arogya Mandir Individual Feedback Report</h2>
            <p style="margin:4px 0; color:#64748b; font-size:12px;">Tracking ID: ${record.trackingId}</p>
          </div>
          <button onclick="window.print()" style="background:#001529; color:white; border:none; padding:8px 16px; border-radius:6px; cursor:pointer; font-weight:bold;">🖨️ Print PDF</button>
        </div>

        <div class="box">
          <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:10px; font-size:13px;">
            <div><strong>Patient Name:</strong> ${record.patientName}</div>
            <div><strong>Mobile:</strong> ${record.mobileNumber}</div>
            <div><strong>Date:</strong> ${record.timestamp || record.date}</div>
            <div><strong>Clinic Name:</strong> ${record.clinicName || record.facilityName}</div>
            <div><strong>Station HQ:</strong> ${record.stationHq || 'Jamnagar HQ'}</div>
            <div><strong>Clinic Code:</strong> ${record.clinicCode || 'JAM/PC/RAJ'}</div>
            <div><strong>Overall Rating:</strong> <span class="tag">${record.responseType || record.overallRating}</span></div>
            <div><strong>Status:</strong> ${record.status}</div>
            <div><strong>Visitor Category:</strong> ${record.visitorType || 'ESM/Spouse'}</div>
          </div>
        </div>

        <h3>Submitted Answers & Feedback</h3>
        <table>
          <thead>
            <tr>
              <th>Sr.</th>
              <th>Question Area</th>
              <th>Rating / Answer</th>
              <th>Patient Comments</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Token & Registration Counter</td>
              <td>${record.registration?.rating}</td>
              <td>${record.registration?.comments || 'N/A'}</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Doctor Consultation & Care</td>
              <td>${record.doctor?.rating}</td>
              <td>${record.doctor?.comments || 'N/A'}</td>
            </tr>
            <tr>
              <td>3</td>
              <td>Pharmacy Medicine Availability</td>
              <td>${record.pharmacy?.rating}</td>
              <td>${record.pharmacy?.comments || 'N/A'}</td>
            </tr>
            <tr>
              <td>4</td>
              <td>Cleanliness & Facility Comfort</td>
              <td>${record.cleanliness?.rating}</td>
              <td>${record.cleanliness?.comments || 'N/A'}</td>
            </tr>
            <tr>
              <td>5</td>
              <td>General Suggestions</td>
              <td>N/A</td>
              <td>${record.suggestions?.text || 'None'}</td>
            </tr>
          </tbody>
        </table>

        ${record.officerNotes && record.officerNotes.length > 0 ? `
          <h3 style="margin-top:25px;">Officer Resolution Audit Trail</h3>
          <ul>
            ${record.officerNotes.map(n => `<li><strong>${n.date} - ${n.officer}:</strong> ${n.note}</li>`).join('')}
          </ul>
        ` : ''}

      </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
};
