import ExcelJS from 'exceljs';
const ExportExcel = (headers:any[],formattedData:any[],fileName:string) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(fileName);

  // Thêm header với màu nền
  worksheet.addRow(headers);
  const headerRow = worksheet.getRow(1);
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFF00' }, // Màu vàng
    };
    cell.font = { bold: true };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  });

  // Thêm dữ liệu
  formattedData.forEach((row) => {
    worksheet.addRow(Object.values(row));
  });

  // Tự động điều chỉnh độ rộng cột
  worksheet.columns.forEach((column, colIndex) => {
    const header = headers[colIndex];
    const data = [header, ...formattedData.map(row => String(row[header] || ''))];
    const maxLength = Math.max(...data.map(val => val.length));
    column.width = Math.min(maxLength + 2, 50); // +2 để có khoảng trống, tối đa 50
  });

  // Xuất file
  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  });
};

export default ExportExcel;