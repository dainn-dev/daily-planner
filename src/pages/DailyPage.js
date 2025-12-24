import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { DEFAULT_TAGS } from '../constants/tasks';

const DailyPage = () => {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Gửi email báo cáo cho khách hàng A', completed: true, tags: ['Routine'] },
    { id: 2, text: 'Review code module thanh toán', completed: false, priority: 'Cao', tags: ['Dev'] },
    { id: 3, text: 'Đặt lịch khám sức khỏe định kỳ', completed: false, tags: ['Cá nhân'] },
    { id: 4, text: 'Chuẩn bị tài liệu cho buổi họp sáng mai', completed: false, priority: 'Trung bình', tags: [] },
  ]);

  const [newTask, setNewTask] = useState('');
  const [mainGoalCompleted, setMainGoalCompleted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [addTaskModalOpen, setAddTaskModalOpen] = useState(false);
  const [taskForm, setTaskForm] = useState({
    name: '',
    description: '',
    dueDate: '',
    reminderTime: '',
    tags: []
  });
  const [showNewTagInput, setShowNewTagInput] = useState(false);
  const [newTagValue, setNewTagValue] = useState('');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'task',
      title: 'Nhắc nhở nhiệm vụ',
      message: 'Đến hạn nộp báo cáo quý vào lúc 14:00 chiều nay. Đừng quên kiểm tra lại số liệu.',
      time: '15 phút trước',
      unread: true,
      icon: 'assignment_late',
      iconBg: 'bg-blue-100',
      iconColor: 'text-primary'
    },
    {
      id: 2,
      type: 'goal',
      title: 'Cập nhật mục tiêu',
      message: 'Chúc mừng! Bạn đã hoàn thành 50% tiến độ mục tiêu "Chạy bộ mỗi sáng".',
      time: '2 giờ trước',
      unread: true,
      icon: 'emoji_events',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      id: 3,
      type: 'system',
      title: 'Cập nhật hệ thống',
      message: 'Tính năng đồng bộ lịch Google Calendar đã sẵn sàng để sử dụng.',
      time: 'Hôm qua',
      unread: false,
      icon: 'settings',
      iconBg: 'bg-gray-100',
      iconColor: 'text-gray-500'
    }
  ]);

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleTaskToggle = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      setTasks([...tasks, {
        id: Date.now(),
        text: newTask.trim(),
        completed: false,
        tags: []
      }]);
      setNewTask('');
    }
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleTagToggle = (tag) => {
    setTaskForm(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (taskForm.name.trim()) {
      const newTaskItem = {
        id: Date.now(),
        text: taskForm.name.trim(),
        completed: false,
        description: taskForm.description,
        dueDate: taskForm.dueDate,
        reminderTime: taskForm.reminderTime,
        tags: taskForm.tags,
        priority: taskForm.tags.includes('Công việc') ? 'Cao' : undefined
      };
      setTasks([...tasks, newTaskItem]);
      setTaskForm({
        name: '',
        description: '',
        dueDate: '',
        reminderTime: '',
        tags: []
      });
      setAddTaskModalOpen(false);
    }
  };

  const handleCloseModal = () => {
    setAddTaskModalOpen(false);
    setTaskForm({
      name: '',
      description: '',
      dueDate: '',
      reminderTime: '',
      tags: []
    });
    setShowNewTagInput(false);
    setNewTagValue('');
  };

  const handleAddNewTag = () => {
    if (newTagValue.trim()) {
      handleTagToggle(newTagValue.trim());
      setNewTagValue('');
      setShowNewTagInput(false);
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'Cao':
        return 'bg-red-50 text-red-600 ring-1 ring-inset ring-red-200';
      case 'Trung bình':
        return 'bg-yellow-50 text-yellow-600 ring-1 ring-inset ring-yellow-200';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const today = new Date();
  const dayNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const dayName = dayNames[today.getDay()];
  const dateStr = `${today.getDate()}/${today.getMonth() + 1}`;

  return (
    <div className="bg-[#f6f7f8] text-[#111418] font-display overflow-x-hidden min-h-screen flex flex-row">
      {/* Sidebar - Desktop */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          title="Kế hoạch hôm nay"
          icon="calendar_today"
          actionButton={{
            text: 'Thêm nhiệm vụ',
            icon: 'add',
            onClick: () => setAddTaskModalOpen(true)
          }}
          notifications={notifications}
          onNotificationsChange={setNotifications}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex justify-center py-6 px-4 md:px-8 overflow-y-auto">
          <div className="max-w-[1200px] flex-1 flex flex-col gap-6 w-full">
            {/* Date and Progress Card */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex flex-col gap-2">
                <p className="text-[#111418] text-4xl font-black leading-tight tracking-[-0.033em]">
                  {dayName}, {dateStr}
                </p>
                <p className="text-gray-500 text-base font-normal leading-normal">
                  Xin chào, hãy bắt đầu ngày mới hiệu quả.
                </p>
              </div>
              <div className="flex min-w-[200px] flex-col gap-1 rounded-lg p-4 bg-white border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-gray-600 text-sm font-medium leading-normal">Tiến độ hôm nay</p>
                  <span className="material-symbols-outlined text-[#0bda5b]">trending_up</span>
                </div>
                <div className="flex items-end gap-2">
                  <p className="text-[#111418] text-3xl font-bold leading-tight">{progressPercentage}%</p>
                  <p className="text-gray-500 text-xs pb-1">hoàn thành</p>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                  <div 
                    className="bg-[#1380ec] h-1.5 rounded-full transition-all duration-300" 
                    style={{ width: `${progressPercentage}%` }}
                    role="progressbar"
                    aria-valuenow={progressPercentage}
                    aria-valuemin="0"
                    aria-valuemax="100"
                    aria-label={`Tiến độ: ${progressPercentage}%`}
                  />
                </div>
              </div>
            </div>

            {/* Main Goal Card */}
            <div className="w-full">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 rounded-xl border border-blue-100 bg-white p-5 shadow-lg shadow-blue-50 relative overflow-hidden group">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                <div className="flex flex-col gap-1 z-10 pl-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="material-symbols-outlined text-primary text-sm">flag</span>
                    <p className="text-primary text-xs font-bold uppercase tracking-wider">Mục tiêu chính</p>
                  </div>
                  <p className={`text-[#111418] text-xl font-bold leading-tight group-hover:text-primary transition-colors ${mainGoalCompleted ? 'line-through text-gray-400' : ''}`}>
                    Hoàn thành báo cáo quý cho cuộc họp ban giám đốc
                  </p>
                </div>
                <label className="relative flex cursor-pointer items-center gap-3 z-10">
                  <span className="text-gray-500 text-sm hidden sm:block">Đánh dấu hoàn thành</span>
                  <div className={`relative flex h-[31px] w-[51px] items-center rounded-full border-none p-0.5 transition-colors ${mainGoalCompleted ? 'bg-[#1380ec]' : 'bg-gray-200'}`}>
                    <div 
                      className={`h-[27px] w-[27px] rounded-full bg-white shadow-md transition-transform ${mainGoalCompleted ? 'translate-x-[20px]' : 'translate-x-0'}`}
                    />
                    <input 
                      className="peer sr-only" 
                      type="checkbox"
                      checked={mainGoalCompleted}
                      onChange={(e) => setMainGoalCompleted(e.target.checked)}
                      aria-label="Đánh dấu mục tiêu chính hoàn thành"
                    />
                  </div>
                </label>
              </div>
            </div>

            {/* Schedule and Tasks Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
              {/* Schedule Section */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-[#111418]">schedule</span>
                  <h2 className="text-[#111418] text-xl font-bold">Lịch trình</h2>
                </div>
                <div className="flex flex-col gap-4">
                  {/* Morning Run - Completed */}
                  <div className="flex gap-4 group">
                    <div className="flex flex-col items-center pt-1 w-12 flex-shrink-0">
                      <span className="text-gray-400 text-sm font-medium">08:00</span>
                      <div className="w-px h-full bg-gray-200 mt-2"></div>
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <p className="text-gray-400 font-medium line-through">Chạy bộ buổi sáng</p>
                        <div className="flex items-center gap-1 mt-2 text-gray-400 text-xs">
                          <span className="material-symbols-outlined text-[14px]">location_on</span>
                          <span>Công viên</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Team Meeting - Active */}
                  <div className="flex gap-4 group">
                    <div className="flex flex-col items-center pt-1 w-12 flex-shrink-0">
                      <span className="text-[#111418] text-sm font-bold">10:00</span>
                      <div className="w-px h-full bg-gray-200 mt-2"></div>
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="bg-white p-4 rounded-lg border-l-4 border-l-primary shadow-md shadow-gray-100">
                        <div className="flex justify-between items-start">
                          <p className="text-[#111418] font-bold text-lg">Họp team Marketing</p>
                          <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">Đang diễn ra</span>
                        </div>
                        <p className="text-gray-500 text-sm mt-1">Review KPI tháng 10 và lên plan tháng 11</p>
                        <div className="flex items-center gap-3 mt-3">
                          <div className="flex -space-x-2">
                            <div 
                              className="size-6 rounded-full bg-gray-300 border border-white bg-cover bg-center" 
                              style={{
                                backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAj-399vd1HQXp1YrcnzEKF8yrWnYtfzgN_oxOJuA-jADz6Aylvemq0KJvVxGck7o8K0ZMPwhPOUOhnapKb81JxoLiB1YsrJUJLQazY85ilnYAPfK1fLIQ74fgYwFkoj26sqr_nVd3jUKyHcmrDPVsJlW2encAOO3SVnrx0TTfj9CXURYn1HvMAjUSuCUbXijEqn6sWW09enMGFwIJqwiaqXsZBdF1EoRHasmWbW21ZDIUtSxL-4e1ooFmbtYiXe-Cnlf5BgnUPySs0")'
                              }}
                              aria-label="Team member 1"
                            />
                            <div 
                              className="size-6 rounded-full bg-gray-300 border border-white bg-cover bg-center" 
                              style={{
                                backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDENeKXc4H7FwO0ti1bd6RysdILZdH07zF2fmCSR3mtPvM2PUpHuGLavpmwMerBdxNeKO_WDvID4xVbcea7YljLtYQby8mkU_3eJjELwo0PZs4NTurSrCusMBo2PNYRcLrm3bbhLGNfdPhM4DK4JyPUTwdbO0rRakkM9RN1Zn-YcU5ympZBkavG0BI5pa3HUCO5foFhnfqSSUPtcJjDz58nynazKD9yX4I4iA5jAB7D_H-x6vlFjHoq8bm-ETjWW3wlw45427guBMQP")'
                              }}
                              aria-label="Team member 2"
                            />
                            <div className="size-6 rounded-full bg-gray-300 border border-white flex items-center justify-center text-[10px] text-gray-600 font-medium">
                              +3
                            </div>
                          </div>
                          <span className="text-gray-500 text-xs">Room 301</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Interview - Upcoming */}
                  <div className="flex gap-4 group">
                    <div className="flex flex-col items-center pt-1 w-12 flex-shrink-0">
                      <span className="text-gray-500 text-sm font-medium">14:00</span>
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="bg-white p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
                        <p className="text-[#111418] font-medium">Phỏng vấn ứng viên Designer</p>
                        <div className="flex items-center gap-1 mt-2 text-gray-500 text-xs">
                          <span className="material-symbols-outlined text-[14px]">videocam</span>
                          <span>Google Meet</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tasks Section */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#111418]">check_circle</span>
                    <h2 className="text-[#111418] text-xl font-bold">Nhiệm vụ</h2>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-gray-600 hover:text-[#111418] text-sm font-medium px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 transition-colors">
                      Tất cả
                    </button>
                    <button className="text-white text-sm font-medium px-3 py-1 rounded bg-primary shadow-sm shadow-primary/30">
                      Ưu tiên
                    </button>
                  </div>
                </div>

                {/* Add Task Input */}
                <form onSubmit={handleAddTask} className="relative group mb-2">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-gray-400">add</span>
                  </div>
                  <input 
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg leading-5 bg-white text-[#111418] placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm transition-all" 
                    placeholder="Thêm nhiệm vụ mới..." 
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                  />
                </form>

                {/* Tasks List */}
                <div className="flex flex-col gap-3">
                  {tasks.map((task) => (
                    <div 
                      key={task.id} 
                      className="group flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-4 transition-all hover:bg-gray-50"
                    >
                      <div className="flex items-start gap-4 flex-1">
                        <div className="relative flex items-center pt-1">
                          <input 
                            checked={task.completed} 
                            className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-300 bg-transparent checked:border-primary checked:bg-primary transition-all hover:border-primary/50" 
                            type="checkbox"
                            onChange={() => handleTaskToggle(task.id)}
                            aria-label={`Đánh dấu hoàn thành: ${task.text}`}
                          />
                          <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 transition-opacity pt-1">
                            <span className="material-symbols-outlined text-[16px] font-bold">check</span>
                          </span>
                        </div>
                        <div className="flex flex-col gap-1 flex-1">
                          <p className={`text-base font-medium leading-tight ${task.completed ? 'text-gray-400 line-through' : 'text-[#111418]'}`}>
                            {task.text}
                          </p>
                          <div className="flex items-center gap-2 flex-wrap">
                            {task.priority && (
                              <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${getPriorityBadgeClass(task.priority)}`}>
                                {task.priority}
                              </span>
                            )}
                            {task.tags.map((tag, idx) => (
                              <span key={idx} className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <button 
                        className="invisible group-hover:visible text-gray-400 hover:text-red-500 transition-colors"
                        onClick={() => handleDeleteTask(task.id)}
                        aria-label={`Xóa nhiệm vụ: ${task.text}`}
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      {addTaskModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-gray-900/10 backdrop-blur-sm transition-all duration-300"
          onClick={handleCloseModal}
        >
          <div
            className="w-full max-w-[580px] flex flex-col bg-surface-light rounded-2xl shadow-float border border-white/50 overflow-hidden max-h-[90vh] animate-fadeInScale ring-1 ring-black/5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between px-8 pt-8 pb-4 bg-surface-light shrink-0">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Thêm Nhiệm Vụ</h2>
                <p className="text-sm text-gray-500 mt-1 font-normal">Tạo một mục tiêu mới cho kế hoạch của bạn.</p>
              </div>
              <button 
                aria-label="Đóng"
                className="group p-2 -mr-2 -mt-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
                onClick={handleCloseModal}
              >
                <span className="material-symbols-outlined text-gray-400 group-hover:text-gray-600 text-[24px]">close</span>
              </button>
            </div>
            <form onSubmit={handleCreateTask}>
              <div className="px-8 py-2 overflow-y-auto flex flex-col gap-6 custom-scrollbar bg-surface-light">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Tên nhiệm vụ
                  </label>
                  <div className="relative group">
                    <input
                      autoFocus
                      className="form-input w-full rounded-lg border-gray-200 bg-white text-gray-900 px-4 py-3 text-base focus:border-gray-400 focus:bg-white focus:ring-0 placeholder:text-gray-400 transition-all font-medium shadow-sm hover:border-gray-300"
                      placeholder="Nhập tên nhiệm vụ..."
                      type="text"
                      value={taskForm.name}
                      onChange={(e) => setTaskForm(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Mô tả
                  </label>
                  <div className="relative group">
                    <textarea
                      className="form-input w-full rounded-lg border-gray-200 bg-white text-gray-900 px-4 py-3 text-sm focus:border-gray-400 focus:bg-white focus:ring-0 placeholder:text-gray-400 transition-all resize-none min-h-[90px] leading-relaxed shadow-sm hover:border-gray-300"
                      placeholder="Thêm chi tiết về nhiệm vụ này..."
                      value={taskForm.description}
                      onChange={(e) => setTaskForm(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Ngày đến hạn</label>
                    <div className="relative group">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-[18px] pointer-events-none">event</span>
                      <input
                        className="form-input w-full rounded-lg border-gray-200 bg-white text-gray-900 pl-10 pr-4 py-2.5 text-sm focus:border-gray-400 focus:bg-white focus:ring-0 transition-all cursor-pointer hover:bg-gray-50 shadow-sm"
                        type="date"
                        value={taskForm.dueDate}
                        onChange={(e) => setTaskForm(prev => ({ ...prev, dueDate: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Giờ nhắc</label>
                    <div className="relative group">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-[18px] pointer-events-none">schedule</span>
                      <input
                        className="form-input w-full rounded-lg border-gray-200 bg-white text-gray-900 pl-10 pr-4 py-2.5 text-sm focus:border-gray-400 focus:bg-white focus:ring-0 transition-all cursor-pointer hover:bg-gray-50 shadow-sm"
                        type="time"
                        value={taskForm.reminderTime}
                        onChange={(e) => setTaskForm(prev => ({ ...prev, reminderTime: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-3 pt-2 pb-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                      Thẻ
                    </label>
                  </div>
                  {/* Selected Tags Display */}
                  {taskForm.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                      {taskForm.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-full shadow-sm"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleTagToggle(tag)}
                            className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                            aria-label={`Xóa thẻ ${tag}`}
                          >
                            <span className="material-symbols-outlined text-[14px]">close</span>
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {DEFAULT_TAGS.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        className={`group flex items-center gap-1.5 px-3.5 py-1.5 border rounded-full transition-all duration-200 shadow-sm ${
                          taskForm.tags.includes(tag)
                            ? 'bg-primary border-primary text-white hover:bg-primary-hover'
                            : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                        onClick={() => handleTagToggle(tag)}
                      >
                        <span className="text-xs font-medium">{tag}</span>
                        {taskForm.tags.includes(tag) && (
                          <span className="material-symbols-outlined text-[14px] ml-0.5">close</span>
                        )}
                      </button>
                    ))}
                    {showNewTagInput ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={newTagValue}
                          onChange={(e) => setNewTagValue(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddNewTag();
                            }
                          }}
                          placeholder="Tên thẻ mới..."
                          autoFocus
                          className="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                        <button
                          type="button"
                          onClick={handleAddNewTag}
                          className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white hover:bg-primary-hover transition-colors"
                          aria-label="Xác nhận thêm thẻ"
                        >
                          <span className="material-symbols-outlined text-[16px]">check</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowNewTagInput(false);
                            setNewTagValue('');
                          }}
                          className="flex items-center justify-center w-7 h-7 rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all"
                          aria-label="Hủy"
                        >
                          <span className="material-symbols-outlined text-[16px]">close</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="group flex items-center justify-center w-8 h-8 rounded-full border border-dashed border-gray-300 text-gray-400 hover:text-gray-900 hover:border-gray-400 hover:bg-gray-50 transition-all"
                        onClick={() => setShowNewTagInput(true)}
                        aria-label="Thêm thẻ mới"
                      >
                        <span className="material-symbols-outlined text-[16px]">add</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="px-8 py-6 bg-surface-light flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  className="px-5 py-2.5 rounded-lg text-gray-500 font-medium hover:text-gray-900 hover:bg-gray-100 transition-colors text-sm"
                  onClick={handleCloseModal}
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-white font-semibold hover:bg-primary-hover transition-all shadow-minimal active:scale-[0.98] text-sm tracking-wide"
                >
                  Tạo nhiệm vụ
                </button>
              </div>
            </form>
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
      <nav className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 lg:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center gap-3 border-b border-gray-100">
          <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-xl">calendar_today</span>
          </div>
          <h1 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em]">PlanDaily</h1>
          <button 
            className="ml-auto p-1 rounded-md text-gray-600 hover:bg-gray-100"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="flex flex-col gap-2 p-4 flex-1">
          <Link 
            to="/daily" 
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-blue-50 text-primary font-medium transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="material-symbols-outlined fill-1">today</span>
            <span>Kế hoạch hôm nay</span>
          </Link>
          <Link 
            to="/goals" 
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-[#111418] font-medium transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="material-symbols-outlined">target</span>
            <span>Quản lý mục tiêu</span>
          </Link>
          <Link 
            to="/calendar" 
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-[#111418] font-medium transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="material-symbols-outlined">calendar_month</span>
            <span>Lịch biểu</span>
          </Link>
          <Link 
            to="/settings" 
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-[#111418] font-medium transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="material-symbols-outlined">settings</span>
            <span>Thiết lập</span>
          </Link>
          <div className="mt-auto border-t border-gray-100 pt-4">
            <button 
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-[#111418] font-medium transition-colors w-full"
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

export default DailyPage;

