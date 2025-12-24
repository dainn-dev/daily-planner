import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import {
  getColorClasses,
  getTextColorClasses,
  getDotColorClasses,
  getTimeColorClasses,
  EVENT_COLORS,
} from '../utils/colorMappings';

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2023, 9, 1)); // October 2023
  const [viewMode, setViewMode] = useState('Tuần'); // 'Tuần' or 'Tháng'
  const [events, setEvents] = useState([
    { id: 1, date: new Date(2023, 9, 2), time: '09:00', title: 'Review thiết kế UI', color: 'green' },
    { id: 2, date: new Date(2023, 9, 4), time: '14:00', title: 'Họp team Product', color: 'blue' },
    { id: 3, date: new Date(2023, 9, 5), time: '08:30', title: 'Chạy bộ buổi sáng', color: 'purple' },
    { id: 4, date: new Date(2023, 9, 5), time: '16:00', title: 'Gọi khách hàng', color: 'orange' },
    { id: 5, date: new Date(2023, 9, 10), title: 'Nghỉ phép', color: 'emerald', allDay: true },
    { id: 6, date: new Date(2023, 9, 11), title: 'Nghỉ phép', color: 'emerald', allDay: true },
    { id: 7, date: new Date(2023, 9, 15), time: '10:00', title: 'Deadline Báo cáo', color: 'rose' },
    { id: 8, date: new Date(2023, 9, 24), time: '19:00', title: 'Ăn tối team', color: 'indigo' },
  ]);

  const [addEventModalOpen, setAddEventModalOpen] = useState(false);
  const [eventDetailModalOpen, setEventDetailModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditingEvent, setIsEditingEvent] = useState(false);
  const [editedEvent, setEditedEvent] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: '',
    date: '',
    timeFrom: '',
    timeTo: '',
    color: 'green',
    allDay: false,
    locationType: '',
    platform: '',
    address: '',
  });
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'event',
      title: 'Nhắc nhở sự kiện',
      message: 'Họp team Product vào lúc 14:00 chiều nay. Đừng quên chuẩn bị tài liệu.',
      time: '30 phút trước',
      unread: true,
      icon: 'event_note',
      iconBg: 'bg-blue-100',
      iconColor: 'text-indigo-600'
    },
    {
      id: 2,
      type: 'calendar',
      title: 'Cập nhật lịch',
      message: 'Bạn có 3 sự kiện trong tuần này. Hãy kiểm tra lịch trình của mình.',
      time: '1 giờ trước',
      unread: true,
      icon: 'calendar_month',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      id: 3,
      type: 'system',
      title: 'Đồng bộ thành công',
      message: 'Lịch của bạn đã được đồng bộ với Google Calendar.',
      time: 'Hôm qua',
      unread: false,
      icon: 'sync',
      iconBg: 'bg-gray-100',
      iconColor: 'text-gray-500'
    }
  ]);

  // Get month name in Vietnamese
  const getMonthName = (date) => {
    const months = [
      'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
      'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];
    return months[date.getMonth()];
  };

  // Navigate months/weeks
  const changeMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const changeWeek = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + (direction * 7));
      return newDate;
    });
  };

  // Go to today
  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
  };

  // Handle add event modal
  const handleOpenAddEventModal = () => {
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    setEventForm({
      title: '',
      date: dateStr,
      timeFrom: '',
      timeTo: '',
      color: 'green',
      allDay: false,
      locationType: '',
      platform: '',
      address: '',
    });
    setAddEventModalOpen(true);
  };

  const handleCloseAddEventModal = () => {
    setAddEventModalOpen(false);
    setEventForm({
      title: '',
      date: '',
      timeFrom: '',
      timeTo: '',
      color: 'green',
      allDay: false,
      locationType: '',
      platform: '',
      address: '',
    });
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    
    if (!eventForm.title.trim()) {
      return;
    }

    const [year, month, day] = eventForm.date.split('-').map(Number);
    const newEvent = {
      id: Date.now(),
      date: new Date(year, month - 1, day),
      title: eventForm.title.trim(),
      color: eventForm.color,
      allDay: eventForm.allDay,
    };

    if (!eventForm.allDay && eventForm.timeFrom) {
      newEvent.timeFrom = eventForm.timeFrom;
      if (eventForm.timeTo) {
        newEvent.timeTo = eventForm.timeTo;
      }
      // For backward compatibility, also set time to timeFrom
      newEvent.time = eventForm.timeFrom;
    }

    if (eventForm.locationType) {
      newEvent.locationType = eventForm.locationType;
      if (eventForm.locationType === 'online' && eventForm.platform) {
        newEvent.platform = eventForm.platform;
      } else if (eventForm.locationType === 'offline' && eventForm.address) {
        newEvent.address = eventForm.address;
      }
    }

    setEvents([...events, newEvent]);
    handleCloseAddEventModal();
  };

  // Handle delete event
  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter(event => event.id !== eventId));
    if (selectedEvent && selectedEvent.id === eventId) {
      setEventDetailModalOpen(false);
      setSelectedEvent(null);
    }
  };

  // Handle show event detail
  const handleShowEventDetail = (event) => {
    setSelectedEvent(event);
    setEditedEvent({ ...event });
    setIsEditingEvent(false);
    setEventDetailModalOpen(true);
  };

  const handleCloseEventDetail = () => {
    setEventDetailModalOpen(false);
    setSelectedEvent(null);
    setEditedEvent(null);
    setIsEditingEvent(false);
  };

  const handleStartEdit = () => {
    setIsEditingEvent(true);
  };

  const handleCancelEdit = () => {
    setEditedEvent({ ...selectedEvent });
    setIsEditingEvent(false);
  };

  const handleSaveEvent = () => {
    if (!editedEvent.title.trim()) {
      return;
    }

    // Update the event in the events array
    setEvents(events.map(event => 
      event.id === editedEvent.id ? editedEvent : event
    ));
    
    setSelectedEvent(editedEvent);
    setIsEditingEvent(false);
  };

  const handleFieldChange = (field, value) => {
    setEditedEvent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Format date for display
  const formatDate = (date) => {
    const d = new Date(date);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    const dayNames = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const dayName = dayNames[d.getDay()];
    return `${dayName}, ${day}/${month}/${year}`;
  };

  // Convert solar date to lunar date (simplified Vietnamese lunar calendar)
  // Note: This is a simplified version. For production, use a proper lunar calendar library
  const convertToLunar = (solarDate) => {
    const d = new Date(solarDate);
    // const year = d.getFullYear();
    // const month = d.getMonth() + 1;
    // const day = d.getDate();

    // Base reference: January 1, 1900 (solar) = December 1, 1899 (lunar)
    // This is a simplified approximation
    const baseSolar = new Date(1900, 0, 1);
    const baseLunar = { year: 1899, month: 12, day: 1 };
    
    const diffDays = Math.floor((d - baseSolar) / (1000 * 60 * 60 * 24));
    
    // Approximate lunar month = 29.53 days
    const lunarDays = baseLunar.day + diffDays;
    let lunarMonth = baseLunar.month;
    let lunarYear = baseLunar.year;
    
    // Simplified calculation (not astronomically accurate)
    let remainingDays = lunarDays;
    const lunarMonths = [29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30]; // Approximate month lengths
    
    while (remainingDays > 0) {
      const monthLength = lunarMonths[(lunarMonth - 1) % 12];
      if (remainingDays > monthLength) {
        remainingDays -= monthLength;
        lunarMonth++;
        if (lunarMonth > 12) {
          lunarMonth = 1;
          lunarYear++;
        }
      } else {
        break;
      }
    }
    
    const lunarDay = Math.floor(remainingDays) || 1;
    
    // Vietnamese month names
    const lunarMonthNames = [
      'Giêng', 'Hai', 'Ba', 'Tư', 'Năm', 'Sáu',
      'Bảy', 'Tám', 'Chín', 'Mười', 'Mười một', 'Chạp'
    ];
    
    return {
      day: lunarDay,
      month: lunarMonth,
      year: lunarYear,
      monthName: lunarMonthNames[lunarMonth - 1] || '',
      display: `${lunarDay}/${lunarMonth}`
    };
  };

  // Generate week view (7 days starting from Monday)
  const generateWeek = () => {
    const date = new Date(currentDate);
    const dayOfWeek = date.getDay();
    // Convert Sunday (0) to 6, Monday (1) to 0, etc.
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const monday = new Date(date);
    monday.setDate(date.getDate() - daysToSubtract);
    
    const week = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      week.push(day);
    }
    
    return week;
  };

  // Generate calendar grid (month view)
  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of month
    const firstDay = new Date(year, month, 1);
    // const lastDay = new Date(year, month + 1, 0);
    
    // Start from Monday (adjust if needed)
    const startDate = new Date(firstDay);
    const dayOfWeek = firstDay.getDay();
    // Convert Sunday (0) to 6, Monday (1) to 0, etc.
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startDate.setDate(firstDay.getDate() - daysToSubtract);
    
    const calendar = [];
    const current = new Date(startDate);
    
    // Generate 35 days (5 weeks)
    for (let i = 0; i < 35; i++) {
      calendar.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return calendar;
  };

  const calendarDays = viewMode === 'Tuần' ? generateWeek() : generateCalendar();
  const today = new Date();
  const isToday = (date) => {
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isCurrentMonth = (date) => {
    return date.getMonth() === currentDate.getMonth() &&
           date.getFullYear() === currentDate.getFullYear();
  };

  const getEventsForDate = (date) => {
    return events.filter(event => {
      const eventDate = event.date;
      return eventDate.getDate() === date.getDate() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getFullYear() === date.getFullYear();
    });
  };


  const weekDays = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
  // const weekDaysShort = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

  // Get week number
  const getWeekNumber = (date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  };

  // Get week range text
  const getWeekRange = () => {
    const week = generateWeek();
    const start = week[0];
    const end = week[6];
    const startDay = start.getDate();
    const endDay = end.getDate();
    const startMonth = start.getMonth() + 1;
    const endMonth = end.getMonth() + 1;
    
    if (startMonth === endMonth) {
      return `${startDay} - ${endDay} ${getMonthName(start)}`;
    } else {
      return `${startDay} ${getMonthName(start)} - ${endDay} ${getMonthName(end)}`;
    }
  };

  const weekNumber = getWeekNumber(currentDate);

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, unread: false })));
  };

  const handleDeleteAllNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="bg-white text-slate-700 font-display h-screen flex overflow-hidden selection:bg-indigo-600 selection:text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-slate-50 h-full relative overflow-hidden">
        <header className="flex flex-col bg-white border-b border-gray-200 z-10 sticky top-0 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-3">
            <div className="flex items-center gap-4 text-[#111418]">
                  <button
                className="lg:hidden p-1 -ml-1 rounded-md text-gray-600 hover:bg-gray-100"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Toggle menu"
              >
                <span className="material-symbols-outlined">menu</span>
                  </button>
              <div className="lg:hidden flex items-center gap-2">
                <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-xl">calendar_month</span>
            </div>
          </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                  <h2 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em]">
                  {viewMode === 'Tuần' ? getWeekRange() : `${getMonthName(currentDate)}, ${currentDate.getFullYear()}`}
                </h2>
                  <div className="hidden sm:flex items-center">
                  <button 
                    onClick={() => viewMode === 'Tuần' ? changeWeek(-1) : changeMonth(-1)}
                      className="size-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
                    aria-label={viewMode === 'Tuần' ? 'Previous week' : 'Previous month'}
                  >
                      <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                  </button>
                  <button 
                    onClick={() => viewMode === 'Tuần' ? changeWeek(1) : changeMonth(1)}
                      className="size-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
                    aria-label={viewMode === 'Tuần' ? 'Next week' : 'Next month'}
                  >
                      <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                  </button>
                </div>
              </div>
                <p className="text-gray-500 text-xs hidden sm:block">Tuần {weekNumber} • Các sự kiện quan trọng</p>
            </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Calendar Controls */}
              <div className="hidden md:flex items-center gap-2">
                <div className="flex p-1 bg-gray-50 rounded-lg border border-gray-200">
                  <label className={`cursor-pointer relative px-3 py-1.5 text-sm transition-colors rounded-md ${
                  viewMode === 'Tuần' 
                      ? 'bg-white shadow-sm text-gray-800 font-semibold' 
                      : 'font-medium text-gray-500 hover:text-gray-800'
                }`}>
                  <span>Tuần</span>
                  <input 
                    className="hidden" 
                    name="view_mode" 
                    type="radio" 
                    value="Tuần"
                    checked={viewMode === 'Tuần'}
                    onChange={() => setViewMode('Tuần')}
                  />
                </label>
                  <label className={`cursor-pointer relative px-3 py-1.5 text-sm transition-colors rounded-md ${
                  viewMode === 'Tháng' 
                      ? 'bg-white shadow-sm text-gray-800 font-semibold' 
                      : 'font-medium text-gray-500 hover:text-gray-800'
                }`}>
                  <span>Tháng</span>
                  <input 
                    className="hidden" 
                    name="view_mode" 
                    type="radio" 
                    value="Tháng"
                    checked={viewMode === 'Tháng'}
                    onChange={() => setViewMode('Tháng')}
                  />
                </label>
              </div>
              <button 
                onClick={goToToday}
                  className="flex items-center justify-center rounded-lg px-4 py-2 bg-white border border-gray-200 text-gray-800 text-sm font-medium hover:bg-gray-100 transition-all"
              >
                Hôm nay
              </button>
              </div>
              
              {/* Action Button */}
              <button 
                onClick={handleOpenAddEventModal}
                className="hidden sm:flex h-10 cursor-pointer items-center justify-center rounded-lg bg-[#1380ec] px-4 text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-blue-600 transition-colors"
              >
                <span className="mr-2 material-symbols-outlined text-sm">add</span>
                <span className="truncate">Thêm sự kiện</span>
              </button>

              {/* Notifications Dropdown */}
              <div className="relative group">
                <button
                  className="flex size-10 cursor-pointer items-center justify-center rounded-lg bg-blue-50 text-primary hover:bg-blue-100 transition-colors relative"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  aria-label="Notifications"
                  aria-expanded={notificationsOpen}
              >
                  <span className="material-symbols-outlined">notifications</span>
                  {unreadCount > 0 && (
                    <span className="absolute top-2.5 right-2.5 size-2 bg-red-500 rounded-full border border-white"></span>
                  )}
                </button>
                {notificationsOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40"
                      onClick={() => setNotificationsOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden origin-top-right z-50">
                      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-white">
                        <h3 className="font-bold text-[#111418] text-sm">Thông báo</h3>
                        <div className="flex items-center gap-3">
                          <button
                            className="text-[11px] font-medium text-primary hover:text-blue-700 transition-colors"
                            onClick={handleMarkAllAsRead}
                          >
                            Đánh dấu đã đọc
                          </button>
                          <button
                            className="text-[11px] font-medium text-gray-400 hover:text-red-500 transition-colors"
                            onClick={handleDeleteAllNotifications}
                          >
                            Xóa tất cả
              </button>
            </div>
                      </div>
                      <div className="max-h-[360px] overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center text-gray-500 text-sm">
                            Không có thông báo nào
                          </div>
                        ) : (
                          notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`relative flex gap-3 p-4 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50 ${notification.unread ? 'bg-blue-50/40' : ''}`}
                              onClick={() => {
                                setNotifications(notifications.map(n => 
                                  n.id === notification.id ? { ...n, unread: false } : n
                                ));
                              }}
                            >
                              <div className={`size-9 rounded-full ${notification.iconBg} flex items-center justify-center ${notification.iconColor} shrink-0 mt-0.5`}>
                                <span className="material-symbols-outlined text-lg">{notification.icon}</span>
                              </div>
                              <div className="flex-1 space-y-1">
                                <div className="flex justify-between items-start">
                                  <p className={`text-sm leading-tight ${notification.unread ? 'font-semibold' : 'font-medium'} text-[#111418]`}>
                                    {notification.title}
                                  </p>
                                  {notification.unread && (
                                    <span className="size-2 bg-primary rounded-full mt-1"></span>
                                  )}
                                </div>
                                <p className={`text-xs leading-relaxed ${notification.unread ? 'text-gray-600' : 'text-gray-500'} line-clamp-2`}>
                                  {notification.message}
                                </p>
                                <p className="text-[11px] text-gray-400 font-medium pt-0.5">{notification.time}</p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      {notifications.length > 0 && (
                        <Link 
                          to="#"
                          className="block p-3 text-center text-xs font-semibold text-gray-500 hover:text-primary hover:bg-gray-50 border-t border-gray-100 transition-colors"
                          onClick={(e) => {
                            e.preventDefault();
                            setNotificationsOpen(false);
                          }}
                        >
                          Xem tất cả thông báo
                        </Link>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div 
                className="bg-center bg-no-repeat bg-cover rounded-full size-10 cursor-pointer ring-2 ring-transparent hover:ring-primary transition-all" 
                style={{
                  backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBr3X7Z7D9oVzqv59WsWDkRyy7yyUi86zJzG0vYqzFaaGh60Qw5psjFjeEh7oCRNQMb9pV2RNcGZ7LdYuSCCXKNFvIuW_u3KWXWL45QWH4DESIVyRG1t2l4Li_LiWgFjDjzgpaGbmp6v-bJBrouwxbq731SsEPCb6dMx0HOmrZjFpR4YJZ2PZr9ckec2y5gpszHLn_zL10DWuQkfb2ocg5mZ2rT7WUFuO8euRXp4-mErpqaeriYEsTgIevz0gS-hwFDr7N3T-y6mNpV")'
                }}
                role="button"
                aria-label="User profile"
                tabIndex={0}
              />
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="lg:hidden flex border-t border-gray-100 bg-white overflow-x-auto">
            <Link 
              to="/daily" 
              className="flex-1 min-w-[100px] flex items-center justify-center gap-2 py-3 font-medium text-sm whitespace-nowrap px-4 text-gray-500 hover:text-gray-900"
            >
              <span className="material-symbols-outlined text-lg fill-1">today</span>
              Hôm nay
            </Link>
            <Link 
              to="/goals" 
              className="flex-1 min-w-[100px] flex items-center justify-center gap-2 py-3 font-medium text-sm whitespace-nowrap px-4 text-gray-500 hover:text-gray-900"
            >
              <span className="material-symbols-outlined text-lg fill-1">target</span>
              Mục tiêu
            </Link>
            <Link 
              to="/calendar" 
              className="flex-1 min-w-[100px] flex items-center justify-center gap-2 py-3 font-medium text-sm whitespace-nowrap px-4 text-primary border-b-2 border-primary"
            >
              <span className="material-symbols-outlined text-lg">calendar_month</span>
              Lịch biểu
            </Link>
            <Link 
              to="/settings" 
              className="flex-1 min-w-[100px] flex items-center justify-center gap-2 py-3 font-medium text-sm whitespace-nowrap px-4 text-gray-500 hover:text-gray-900"
            >
              <span className="material-symbols-outlined text-lg">settings</span>
              Thiết lập
            </Link>
          </div>
          <div className="grid grid-cols-7 border-t border-slate-200 bg-white">
            {weekDays.map((day, idx) => (
              <div key={idx} className="py-3 px-4 text-center border-r border-slate-200 last:border-r-0">
                <span className={`text-xs font-bold uppercase tracking-wider ${
                  idx >= 5 ? 'text-indigo-600' : 'text-slate-500'
                }`}>
                  {day}
                </span>
              </div>
            ))}
          </div>
        </header>
        <div className="flex-1 overflow-y-auto bg-white">
          <div className={`grid grid-cols-7 ${viewMode === 'Tuần' ? 'grid-rows-1' : 'grid-rows-5'} min-h-[800px] h-full`}>
            {calendarDays.map((day, idx) => {
              const dayEvents = getEventsForDate(day);
              const isCurrentDay = isToday(day);
              const isOtherMonth = viewMode === 'Tháng' && !isCurrentMonth(day);
              const isSelected = viewMode === 'Tháng' && day.getDate() === 5 && isCurrentMonth(day); // Example: day 5 is selected

              return (
                <div
                  key={idx}
                  className={`border-b border-r border-slate-200 p-3 ${viewMode === 'Tuần' ? 'min-h-[calc(100vh-200px)]' : 'min-h-[140px]'} group hover:bg-gray-50 transition-colors relative ${
                    isSelected ? 'bg-indigo-50' : isOtherMonth ? 'bg-gray-50/50' : ''
                  }`}
                >
                  <div className="flex flex-col items-start gap-0.5">
                    <span className={`font-medium text-sm inline-block size-7 text-center leading-7 rounded-full ${
                      isOtherMonth ? 'text-gray-300' : isCurrentDay ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-600/30' : 'text-slate-800 font-semibold'
                    }`}>
                      {day.getDate()}
                    </span>
                    {!isOtherMonth && (
                      <span className="text-[9px] text-slate-400 font-medium leading-tight">
                        {convertToLunar(day).display}
                      </span>
                    )}
                  </div>
                  <button 
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 text-slate-500 hover:text-indigo-600 transition-all p-1 hover:bg-white rounded-full"
                    aria-label="Add event"
                  >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                  </button>
                  <div className="mt-2 flex flex-col gap-2">
                    {dayEvents.map((event) => (
                      <div
                        key={event.id}
                        onClick={() => handleShowEventDetail(event)}
                        className={`w-full rounded-lg px-3 py-2 cursor-pointer transition-all duration-200 shadow-sm relative group/item ${getColorClasses(event.color)}`}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteEvent(event.id);
                          }}
                          className="absolute top-1 right-1 opacity-0 group-hover/item:opacity-100 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-all duration-200 z-10"
                          aria-label={`Xóa sự kiện: ${event.title}`}
                        >
                          <span className="material-symbols-outlined text-[16px]">close</span>
                        </button>
                        {!event.allDay && (
                          <div className="flex items-center gap-2 mb-1">
                            {event.color !== 'emerald' && (
                              <div className={`size-1.5 rounded-full ${getDotColorClasses(event.color)}`}></div>
                            )}
                            <span className={`text-[10px] font-bold tracking-wide ${getTimeColorClasses(event.color)}`}>
                              {event.timeFrom && event.timeTo 
                                ? `${event.timeFrom} - ${event.timeTo}`
                                : event.timeFrom 
                                ? event.timeFrom
                                : event.time || ''
                              }
                            </span>
                          </div>
                        )}
                        <p className={`text-xs font-medium truncate ${getTextColorClasses(event.color)} ${event.allDay ? 'flex items-center gap-1.5' : ''}`}>
                          {event.allDay && <span className="text-base">🌴</span>}
                          {event.title}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Add Event Modal */}
      {addEventModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-zinc-900/20 backdrop-blur-sm transition-all duration-300"
          onClick={handleCloseAddEventModal}
        >
          <div
            className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-md border border-zinc-100"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleAddEvent}>
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-900" id="add-event-title">Thêm Lịch Trình Mới</h3>
                    <p className="text-sm text-zinc-500 mt-1">Tạo một sự kiện mới trong lịch của bạn.</p>
                  </div>
                  <button
                    type="button"
                    className="p-2 -mr-2 -mt-2 rounded-full hover:bg-zinc-100 transition-colors focus:outline-none"
                    onClick={handleCloseAddEventModal}
                    aria-label="Đóng"
                  >
                    <span className="material-symbols-outlined text-zinc-400 hover:text-zinc-600 text-[24px]">close</span>
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="event-title" className="block text-sm font-medium text-zinc-700 mb-1.5">
                      Tiêu đề <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="event-title"
                      required
                      value={eventForm.title}
                      onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                      placeholder="Nhập tiêu đề sự kiện..."
                    />
                  </div>

                  <div>
                    <label htmlFor="event-date" className="block text-sm font-medium text-zinc-700 mb-1.5">
                      Ngày <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="event-date"
                      required
                      value={eventForm.date}
                      onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="event-all-day"
                      checked={eventForm.allDay}
                      onChange={(e) => setEventForm({ ...eventForm, allDay: e.target.checked, timeFrom: e.target.checked ? '' : eventForm.timeFrom, timeTo: e.target.checked ? '' : eventForm.timeTo })}
                      className="h-4 w-4 text-zinc-900 border-zinc-300 rounded focus:ring-zinc-900 cursor-pointer"
                    />
                    <label htmlFor="event-all-day" className="text-sm font-medium text-zinc-700 cursor-pointer">
                      Cả ngày
                    </label>
                  </div>

                  {!eventForm.allDay && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="event-time-from" className="block text-sm font-medium text-zinc-700 mb-1.5">
                          Từ
                        </label>
                        <input
                          type="time"
                          id="event-time-from"
                          value={eventForm.timeFrom}
                          onChange={(e) => setEventForm({ ...eventForm, timeFrom: e.target.value })}
                          className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label htmlFor="event-time-to" className="block text-sm font-medium text-zinc-700 mb-1.5">
                          Đến
                        </label>
                        <input
                          type="time"
                          id="event-time-to"
                          value={eventForm.timeTo}
                          onChange={(e) => setEventForm({ ...eventForm, timeTo: e.target.value })}
                          className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                      Địa điểm (Tùy chọn)
                    </label>
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="add-locationType"
                            value="online"
                            checked={eventForm.locationType === 'online'}
                            onChange={(e) => setEventForm({ ...eventForm, locationType: e.target.value, address: '' })}
                            className="h-4 w-4 text-zinc-900 border-zinc-300 focus:ring-zinc-900"
                          />
                          <span className="text-sm text-zinc-700">Online</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="add-locationType"
                            value="offline"
                            checked={eventForm.locationType === 'offline'}
                            onChange={(e) => setEventForm({ ...eventForm, locationType: e.target.value, platform: '' })}
                            className="h-4 w-4 text-zinc-900 border-zinc-300 focus:ring-zinc-900"
                          />
                          <span className="text-sm text-zinc-700">Offline</span>
                        </label>
                      </div>
                      {eventForm.locationType === 'online' && (
                        <select
                          value={eventForm.platform || ''}
                          onChange={(e) => setEventForm({ ...eventForm, platform: e.target.value })}
                          className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                        >
                          <option value="">Chọn nền tảng</option>
                          <option value="google-meet">Google Meet</option>
                          <option value="teams">Microsoft Teams</option>
                          <option value="whatsapp">WhatsApp</option>
                        </select>
                      )}
                      {eventForm.locationType === 'offline' && (
                        <input
                          type="text"
                          value={eventForm.address || ''}
                          onChange={(e) => setEventForm({ ...eventForm, address: e.target.value })}
                          placeholder="Nhập địa chỉ..."
                          className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                        />
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="event-color" className="block text-sm font-medium text-zinc-700 mb-1.5">
                      Màu sắc
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {EVENT_COLORS.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() => setEventForm({ ...eventForm, color: color.value })}
                          className={`flex flex-col items-center gap-1 p-2 rounded-lg border-2 transition-all ${
                            eventForm.color === color.value
                              ? 'border-zinc-900 bg-zinc-50'
                              : 'border-zinc-200 hover:border-zinc-300'
                          }`}
                        >
                          <div className={`size-6 rounded-full ${color.bg}`}></div>
                          <span className="text-[10px] font-medium text-zinc-600">{color.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-zinc-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse sm:gap-3">
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex justify-center items-center rounded-lg px-4 py-2 bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 transition-colors shadow-sm"
                >
                  Thêm lịch trình
                </button>
                <button
                  type="button"
                  onClick={handleCloseAddEventModal}
                  className="mt-3 sm:mt-0 w-full sm:w-auto inline-flex justify-center items-center rounded-lg px-4 py-2 bg-white text-zinc-700 text-sm font-medium hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 transition-colors border border-zinc-300 shadow-sm"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Event Detail Modal */}
      {eventDetailModalOpen && selectedEvent && editedEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-zinc-900/20 backdrop-blur-sm transition-all duration-300"
          onClick={handleCloseEventDetail}
        >
          <div
            className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-zinc-100 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  {isEditingEvent ? (
                    <input
                      type="text"
                      value={editedEvent.title}
                      onChange={(e) => handleFieldChange('title', e.target.value)}
                      className="w-full text-xl font-semibold text-zinc-900 bg-white border border-zinc-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                    />
                  ) : (
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`size-3 rounded-full ${getDotColorClasses(selectedEvent.color) || 'bg-gray-500'}`}></div>
                      <h3 className="text-xl font-semibold text-zinc-900" id="event-detail-title">
                        {selectedEvent.title}
                      </h3>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {isEditingEvent ? (
                    <>
                      <button
                        type="button"
                        onClick={handleSaveEvent}
                        className="px-4 py-2 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors"
                        aria-label="Lưu"
                      >
                        Lưu
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="px-4 py-2 bg-white text-zinc-900 text-sm font-medium rounded-lg border border-zinc-300 hover:bg-zinc-50 transition-colors"
                        aria-label="Hủy"
                      >
                        Hủy
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={handleStartEdit}
                        className="p-2 rounded-full hover:bg-zinc-100 transition-colors focus:outline-none"
                        aria-label="Chỉnh sửa"
                      >
                        <span className="material-symbols-outlined text-zinc-400 hover:text-zinc-600 text-[20px]">edit</span>
                      </button>
                      <button
                        type="button"
                        className="p-2 -mr-2 rounded-full hover:bg-zinc-100 transition-colors focus:outline-none"
                        onClick={handleCloseEventDetail}
                        aria-label="Đóng"
                      >
                        <span className="material-symbols-outlined text-zinc-400 hover:text-zinc-600 text-[24px]">close</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-zinc-500 mb-1.5">
                    <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                    <span className="font-medium">Ngày</span>
                  </div>
                  {isEditingEvent ? (
                    <input
                      type="date"
                      value={editedEvent.date instanceof Date 
                        ? `${editedEvent.date.getFullYear()}-${String(editedEvent.date.getMonth() + 1).padStart(2, '0')}-${String(editedEvent.date.getDate()).padStart(2, '0')}`
                        : editedEvent.date
                      }
                      onChange={(e) => {
                        const [year, month, day] = e.target.value.split('-').map(Number);
                        handleFieldChange('date', new Date(year, month - 1, day));
                      }}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                    />
                  ) : (
                    <p className="text-sm text-zinc-900 ml-7">{formatDate(selectedEvent.date)}</p>
                  )}
                </div>

                {isEditingEvent ? (
                  <>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="edit-all-day"
                        checked={editedEvent.allDay || false}
                        onChange={(e) => handleFieldChange('allDay', e.target.checked)}
                        className="h-4 w-4 text-zinc-900 border-zinc-300 rounded focus:ring-zinc-900 cursor-pointer"
                      />
                      <label htmlFor="edit-all-day" className="text-sm font-medium text-zinc-700 cursor-pointer">
                        Cả ngày
                      </label>
                    </div>
                    {!editedEvent.allDay && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-zinc-700 mb-1.5">Từ</label>
                          <input
                            type="time"
                            value={editedEvent.timeFrom || ''}
                            onChange={(e) => handleFieldChange('timeFrom', e.target.value)}
                            className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-zinc-700 mb-1.5">Đến</label>
                          <input
                            type="time"
                            value={editedEvent.timeTo || ''}
                            onChange={(e) => handleFieldChange('timeTo', e.target.value)}
                            className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                          />
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {!selectedEvent.allDay && (
                      <div>
                        <div className="flex items-center gap-2 text-sm text-zinc-500 mb-1">
                          <span className="material-symbols-outlined text-[18px]">schedule</span>
                          <span className="font-medium">Thời gian</span>
                        </div>
                        <p className="text-sm text-zinc-900 ml-7">
                          {selectedEvent.timeFrom && selectedEvent.timeTo 
                            ? `${selectedEvent.timeFrom} - ${selectedEvent.timeTo}`
                            : selectedEvent.timeFrom 
                            ? selectedEvent.timeFrom
                            : selectedEvent.time || 'Không có'
                          }
                        </p>
                      </div>
                    )}

                    {selectedEvent.allDay && (
                      <div>
                        <div className="flex items-center gap-2 text-sm text-zinc-500 mb-1">
                          <span className="material-symbols-outlined text-[18px]">event_available</span>
                          <span className="font-medium">Loại</span>
                        </div>
                        <p className="text-sm text-zinc-900 ml-7">Cả ngày</p>
                      </div>
                    )}
                  </>
                )}

                {/* Location Section */}
                <div>
                  <div className="flex items-center gap-2 text-sm text-zinc-500 mb-1.5">
                    <span className="material-symbols-outlined text-[18px]">location_on</span>
                    <span className="font-medium">Địa điểm</span>
                  </div>
                  {isEditingEvent ? (
                    <div className="ml-7 space-y-3">
                      <div className="flex gap-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="locationType"
                            value="online"
                            checked={editedEvent.locationType === 'online'}
                            onChange={(e) => handleFieldChange('locationType', e.target.value)}
                            className="h-4 w-4 text-zinc-900 border-zinc-300 focus:ring-zinc-900"
                          />
                          <span className="text-sm text-zinc-700">Online</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="locationType"
                            value="offline"
                            checked={editedEvent.locationType === 'offline'}
                            onChange={(e) => handleFieldChange('locationType', e.target.value)}
                            className="h-4 w-4 text-zinc-900 border-zinc-300 focus:ring-zinc-900"
                          />
                          <span className="text-sm text-zinc-700">Offline</span>
                        </label>
                      </div>
                      {editedEvent.locationType === 'online' && (
                        <select
                          value={editedEvent.platform || ''}
                          onChange={(e) => handleFieldChange('platform', e.target.value)}
                          className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                        >
                          <option value="">Chọn nền tảng</option>
                          <option value="google-meet">Google Meet</option>
                          <option value="teams">Microsoft Teams</option>
                          <option value="whatsapp">WhatsApp</option>
                        </select>
                      )}
                      {editedEvent.locationType === 'offline' && (
                        <input
                          type="text"
                          value={editedEvent.address || ''}
                          onChange={(e) => handleFieldChange('address', e.target.value)}
                          placeholder="Nhập địa chỉ..."
                          className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                        />
                      )}
                    </div>
                  ) : (
                    <div className="ml-7">
                      {selectedEvent.locationType === 'online' && selectedEvent.platform ? (
                        <p className="text-sm text-zinc-900">
                          Online - {selectedEvent.platform === 'google-meet' ? 'Google Meet' :
                                   selectedEvent.platform === 'teams' ? 'Microsoft Teams' :
                                   selectedEvent.platform === 'whatsapp' ? 'WhatsApp' : selectedEvent.platform}
                        </p>
                      ) : selectedEvent.locationType === 'offline' && selectedEvent.address ? (
                        <p className="text-sm text-zinc-900">{selectedEvent.address}</p>
                      ) : (
                        <p className="text-sm text-zinc-400">Chưa có địa điểm</p>
                      )}
                    </div>
                  )}
                </div>

                {isEditingEvent ? (
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">Màu sắc</label>
                    <div className="grid grid-cols-4 gap-2">
                      {EVENT_COLORS.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() => handleFieldChange('color', color.value)}
                          className={`flex flex-col items-center gap-1 p-2 rounded-lg border-2 transition-all ${
                            editedEvent.color === color.value
                              ? 'border-zinc-900 bg-zinc-50'
                              : 'border-zinc-200 hover:border-zinc-300'
                          }`}
                        >
                          <div className={`size-6 rounded-full ${color.bg}`}></div>
                          <span className="text-[10px] font-medium text-zinc-600">{color.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2 text-sm text-zinc-500 mb-1">
                      <span className="material-symbols-outlined text-[18px]">palette</span>
                      <span className="font-medium">Màu sắc</span>
                    </div>
                    <div className="flex items-center gap-2 ml-7">
                      <div className={`size-4 rounded-full ${getDotColorClasses(selectedEvent.color) || 'bg-gray-500'}`}></div>
                      <span className="text-sm text-zinc-900">
                        {EVENT_COLORS.find(c => c.value === selectedEvent.color)?.label || selectedEvent.color}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {!isEditingEvent && (
              <div className="bg-zinc-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse sm:gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteEvent(selectedEvent.id);
                  }}
                  className="w-full sm:w-auto inline-flex justify-center items-center rounded-lg px-4 py-2 bg-red-600 text-white text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 transition-colors shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px] mr-2">delete</span>
                  Xóa sự kiện
                </button>
                <button
                  type="button"
                  onClick={handleCloseEventDetail}
                  className="mt-3 sm:mt-0 w-full sm:w-auto inline-flex justify-center items-center rounded-lg px-4 py-2 bg-white text-zinc-700 text-sm font-medium hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 transition-colors border border-zinc-300 shadow-sm"
                >
                  Đóng
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <nav className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-200 z-50 transform transition-transform duration-300 lg:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-100">
          <div className="size-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-xl">calendar_today</span>
          </div>
          <h1 className="text-slate-800 text-lg font-bold leading-tight tracking-[-0.015em]">PlanDaily</h1>
          <button 
            className="ml-auto p-1 rounded-md text-slate-600 hover:bg-slate-100"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="flex flex-col gap-2 p-4 flex-1">
          <Link 
            to="/daily" 
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-800 font-medium transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="material-symbols-outlined">today</span>
            <span>Kế hoạch hôm nay</span>
          </Link>
          <Link 
            to="/goals" 
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-800 font-medium transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="material-symbols-outlined">target</span>
            <span>Quản lý mục tiêu</span>
          </Link>
          <Link 
            to="/calendar" 
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-indigo-50 text-indigo-600 font-medium transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="material-symbols-outlined fill-1">calendar_month</span>
            <span>Lịch biểu</span>
          </Link>
          <Link 
            to="/settings" 
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-800 font-medium transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="material-symbols-outlined">settings</span>
            <span>Thiết lập</span>
          </Link>
          <div className="mt-auto border-t border-slate-100 pt-4">
            <button 
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-800 font-medium transition-colors w-full"
              onClick={() => {
                window.location.href = '/login';
              }}
            >
              <span className="material-symbols-outlined">logout</span>
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default CalendarPage;

