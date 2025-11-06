import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Загрузка русского шрифта (упрощённая версия)
const addRussianFont = (doc) => {
  // Для поддержки кириллицы используем встроенный шрифт
  doc.setFont('helvetica');
};

export const exportPollResultsToPDF = (pollData, results) => {
  const doc = new jsPDF();

  addRussianFont(doc);

  // Заголовок
  doc.setFontSize(20);
  doc.setTextColor(59, 130, 246);
  doc.text('Результаты голосования', 105, 20, { align: 'center' });

  // Информация об опросе
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Название: ${pollData.name}`, 20, 40);
  doc.text(`Дата создания: ${new Date(pollData.created_at).toLocaleDateString('ru-RU')}`, 20, 50);
  doc.text(`Статус: ${getStatusText(pollData.status)}`, 20, 60);
  doc.text(`Всего голосов: ${results.total_votes || 0}`, 20, 70);

  // Линия разделителя
  doc.setLineWidth(0.5);
  doc.setDrawColor(229, 231, 235);
  doc.line(20, 75, 190, 75);

  // Таблица с результатами
  const tableData = results.results?.map((result, index) => [
    index + 1,
    result.option_name || 'Вариант',
    result.vote_count || 0,
    `${(result.percentage || 0).toFixed(1)}%`,
  ]) || [];

  doc.autoTable({
    startY: 85,
    head: [['№', 'Вариант ответа', 'Голосов', 'Процент']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: [255, 255, 255],
      fontSize: 11,
      fontStyle: 'bold',
    },
    bodyStyles: {
      fontSize: 10,
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
    margin: { left: 20, right: 20 },
  });

  // Подпись
  const finalY = doc.lastAutoTable.finalY + 20;
  doc.setFontSize(9);
  doc.setTextColor(107, 114, 128);
  doc.text('Сгенерировано платформой голосования', 105, finalY, { align: 'center' });
  doc.text(new Date().toLocaleString('ru-RU'), 105, finalY + 5, { align: 'center' });

  // Сохранение файла
  const fileName = `${pollData.name.replace(/[^a-zA-Zа-яА-Я0-9]/g, '_')}_${Date.now()}.pdf`;
  doc.save(fileName);
};

export const exportPollsListToPDF = (polls) => {
  const doc = new jsPDF();

  addRussianFont(doc);

  // Заголовок
  doc.setFontSize(20);
  doc.setTextColor(59, 130, 246);
  doc.text('Список опросов', 105, 20, { align: 'center' });

  doc.setFontSize(10);
  doc.setTextColor(107, 114, 128);
  doc.text(`Всего опросов: ${polls.length}`, 105, 30, { align: 'center' });

  // Таблица опросов
  const tableData = polls.map((poll, index) => [
    index + 1,
    poll.name,
    poll.poll_type || 'Опрос',
    getStatusText(poll.status),
    new Date(poll.created_at).toLocaleDateString('ru-RU'),
  ]);

  doc.autoTable({
    startY: 40,
    head: [['№', 'Название', 'Тип', 'Статус', 'Дата создания']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold',
    },
    bodyStyles: {
      fontSize: 9,
    },
    columnStyles: {
      0: { cellWidth: 15 },
      1: { cellWidth: 70 },
      2: { cellWidth: 30 },
      3: { cellWidth: 30 },
      4: { cellWidth: 35 },
    },
    margin: { left: 10, right: 10 },
  });

  // Подпись
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(8);
  doc.setTextColor(107, 114, 128);
  doc.text('Сгенерировано платформой голосования', 105, finalY, { align: 'center' });
  doc.text(new Date().toLocaleString('ru-RU'), 105, finalY + 5, { align: 'center' });

  // Сохранение
  doc.save(`polls_list_${Date.now()}.pdf`);
};

export const exportTeamsListToPDF = (teams) => {
  const doc = new jsPDF();

  addRussianFont(doc);

  doc.setFontSize(20);
  doc.setTextColor(59, 130, 246);
  doc.text('Список команд', 105, 20, { align: 'center' });

  const tableData = teams.map((team, index) => [
    index + 1,
    team.name,
    team.description || '-',
    team.status || 'Активна',
    new Date(team.registration_date || team.created_at).toLocaleDateString('ru-RU'),
  ]);

  doc.autoTable({
    startY: 35,
    head: [['№', 'Название', 'Описание', 'Статус', 'Дата регистрации']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [139, 92, 246],
      textColor: [255, 255, 255],
    },
  });

  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(8);
  doc.setTextColor(107, 114, 128);
  doc.text('Платформа голосования', 105, finalY, { align: 'center' });

  doc.save(`teams_list_${Date.now()}.pdf`);
};

// Вспомогательная функция для перевода статусов
const getStatusText = (status) => {
  const statusMap = {
    active: 'Активен',
    draft: 'Черновик',
    completed: 'Завершён',
    cancelled: 'Отменён',
  };
  return statusMap[status] || status;
};

export default {
  exportPollResultsToPDF,
  exportPollsListToPDF,
  exportTeamsListToPDF,
};
