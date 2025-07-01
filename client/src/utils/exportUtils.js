import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// utils/exportUtils.js
export const exportSectionToPDF = async (id, filename = "report.pdf") => {
  const input = document.getElementById(id);
  if (!input) return alert("Element not found");

  // ✅ Add fallback style class to fix issues like "oklch" color parsing
  input.classList.add("pdf-export-mode");

  try {
    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgProps = pdf.getImageProperties(imgData);
    const imgWidth = pageWidth;
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(filename);
  } catch (err) {
    console.error("Error generating PDF:", err);
  } finally {
    // ✅ Always remove the fallback class after export
    input.classList.remove("pdf-export-mode");
  }
};

export const exportCombinedCSV = (
  sections,
  filename = "dashboard-report.csv"
) => {
  let csvContent = "";

  for (const { title, data } of sections) {
    if (!data || data.length === 0) continue;

    csvContent += `${title}\n`;

    const headers = Object.keys(data[0]);
    csvContent += headers.join(",") + "\n";

    for (const row of data) {
      const values = headers.map((header) => {
        let val = row[header];
        if (typeof val === "string") {
          val = `"${val.replace(/"/g, '""')}"`; // escape double quotes
        }
        return val;
      });
      csvContent += values.join(",") + "\n";
    }

    csvContent += "\n"; // space between sections
  }

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};
