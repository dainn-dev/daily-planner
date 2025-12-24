import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const GoalDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [goal, setGoal] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedGoal, setEditedGoal] = useState(null);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'task',
      title: 'Nhắc nhở nhiệm vụ',
      message: 'Đến hạn nộp báo cáo quý vào lúc 14:00 chiều nay.',
      time: '15 phút trước',
      unread: true,
      icon: 'assignment_late',
      iconBg: 'bg-blue-100',
      iconColor: 'text-primary'
    }
  ]);

  // Mock goals data - in a real app, this would come from an API or context
  const [goals] = useState([
    {
      id: 1,
      title: 'Học React Native',
      category: 'Kỹ năng',
      dueDate: '31/12/2023',
      progress: 40,
      icon: 'code',
      status: 'active',
      description: 'Học và thành thạo React Native để phát triển ứng dụng di động cross-platform. Mục tiêu bao gồm việc hoàn thành 3 dự án thực tế.',
      milestones: [
        { id: 1, title: 'Hoàn thành khóa học cơ bản', completed: true, date: '15/10/2023' },
        { id: 2, title: 'Xây dựng ứng dụng Todo đầu tiên', completed: true, date: '01/11/2023' },
        { id: 3, title: 'Tích hợp API và state management', completed: false, date: '15/11/2023' },
        { id: 4, title: 'Publish ứng dụng lên App Store', completed: false, date: '31/12/2023' }
      ],
      tasks: [
        { id: 1, text: 'Hoàn thành bài tập về Navigation', completed: true, date: '20/10/2023' },
        { id: 2, text: 'Học về Redux Toolkit', completed: false, date: '25/11/2023' },
        { id: 3, text: 'Thực hành với Firebase', completed: false, date: '05/12/2023' }
      ]
    },
    {
      id: 2,
      title: 'Tiết kiệm 200 triệu',
      category: 'Tài chính',
      dueDate: '01/06/2024',
      progress: 75,
      icon: 'savings',
      status: 'active',
      description: 'Tiết kiệm 200 triệu VNĐ để có khoản dự phòng và đầu tư cho tương lai. Mục tiêu được chia thành các giai đoạn hàng tháng.',
      milestones: [
        { id: 1, title: 'Tiết kiệm 50 triệu', completed: true, date: '01/03/2024' },
        { id: 2, title: 'Tiết kiệm 100 triệu', completed: true, date: '01/04/2024' },
        { id: 3, title: 'Tiết kiệm 150 triệu', completed: true, date: '01/05/2024' },
        { id: 4, title: 'Đạt mục tiêu 200 triệu', completed: false, date: '01/06/2024' }
      ],
      tasks: [
        { id: 1, text: 'Tạo tài khoản tiết kiệm tự động', completed: true, date: '01/02/2024' },
        { id: 2, text: 'Cắt giảm chi tiêu không cần thiết', completed: true, date: '15/02/2024' },
        { id: 3, text: 'Tìm nguồn thu nhập phụ', completed: false, date: '01/03/2024' }
      ]
    },
    {
      id: 3,
      title: 'Chạy bộ 500km',
      category: 'Sức khỏe',
      dueDate: '30/09/2024',
      progress: 22,
      icon: 'fitness_center',
      status: 'active',
      description: 'Chạy bộ tổng cộng 500km trong năm để cải thiện sức khỏe tim mạch và thể lực. Mục tiêu được chia thành các quãng đường nhỏ mỗi tuần.',
      milestones: [
        { id: 1, title: 'Chạy 100km', completed: false, date: '31/03/2024' },
        { id: 2, title: 'Chạy 250km', completed: false, date: '30/06/2024' },
        { id: 3, title: 'Chạy 400km', completed: false, date: '31/08/2024' },
        { id: 4, title: 'Hoàn thành 500km', completed: false, date: '30/09/2024' }
      ],
      tasks: [
        { id: 1, text: 'Chạy 5km mỗi tuần', completed: true, date: '15/01/2024' },
        { id: 2, text: 'Tham gia giải chạy 10km', completed: false, date: '20/03/2024' },
        { id: 3, text: 'Tăng quãng đường lên 10km/tuần', completed: false, date: '01/04/2024' }
      ]
    }
  ]);

  useEffect(() => {
    const foundGoal = goals.find(g => g.id === parseInt(id));
    if (foundGoal) {
      // Calculate initial progress based on milestones
      const completedMilestones = foundGoal.milestones.filter(m => m.completed).length;
      const totalMilestones = foundGoal.milestones.length;
      const calculatedProgress = totalMilestones > 0 
        ? Math.round((completedMilestones / totalMilestones) * 100) 
        : 0;
      
      const goalWithCalculatedProgress = {
        ...foundGoal,
        progress: calculatedProgress
      };
      
      setGoal(goalWithCalculatedProgress);
      setEditedGoal({ ...goalWithCalculatedProgress });
    } else {
      // Goal not found, redirect to goals page
      navigate('/goals');
    }
  }, [id, goals, navigate]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedGoal({ ...goal });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedGoal({ ...goal });
  };

  const handleSave = () => {
    setGoal(editedGoal);
    setIsEditing(false);
    // In a real app, you would save to API here
    // await updateGoal(editedGoal);
  };

  const handleFieldChange = (field, value) => {
    setEditedGoal(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMilestoneToggle = (milestoneId) => {
    setEditedGoal(prev => {
      const updatedMilestones = prev.milestones.map(m => 
        m.id === milestoneId ? { ...m, completed: !m.completed } : m
      );
      // Calculate progress based on completed milestones
      const completedCount = updatedMilestones.filter(m => m.completed).length;
      const totalCount = updatedMilestones.length;
      const newProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
      
      return {
        ...prev,
        milestones: updatedMilestones,
        progress: newProgress
      };
    });
  };

  const handleTaskToggle = (taskId) => {
    setEditedGoal(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => 
        t.id === taskId ? { ...t, completed: !t.completed } : t
      )
    }));
  };

  const handleAddMilestone = () => {
    const newMilestone = {
      id: Date.now(),
      title: 'Mốc quan trọng mới',
      completed: false,
      date: new Date().toLocaleDateString('vi-VN')
    };
    setEditedGoal(prev => {
      const updatedMilestones = [...prev.milestones, newMilestone];
      // Recalculate progress with new milestone (new one is not completed, so progress may decrease)
      const completedCount = updatedMilestones.filter(m => m.completed).length;
      const totalCount = updatedMilestones.length;
      const newProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
      
      return {
        ...prev,
        milestones: updatedMilestones,
        progress: newProgress
      };
    });
  };

  const handleDeleteMilestone = (milestoneId) => {
    setEditedGoal(prev => {
      const updatedMilestones = prev.milestones.filter(m => m.id !== milestoneId);
      // Recalculate progress after deletion
      const completedCount = updatedMilestones.filter(m => m.completed).length;
      const totalCount = updatedMilestones.length;
      const newProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
      
      return {
        ...prev,
        milestones: updatedMilestones,
        progress: newProgress
      };
    });
  };

  const handleAddTask = () => {
    const newTask = {
      id: Date.now(),
      text: 'Nhiệm vụ mới',
      completed: false,
      date: new Date().toLocaleDateString('vi-VN')
    };
    setEditedGoal(prev => ({
      ...prev,
      tasks: [...prev.tasks, newTask]
    }));
  };

  const handleDeleteTask = (taskId) => {
    setEditedGoal(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== taskId)
    }));
  };

  const iconOptions = [
    { value: 'flag', label: 'Mục tiêu' },
    { value: 'code', label: 'Kỹ năng' },
    { value: 'savings', label: 'Tài chính' },
    { value: 'fitness_center', label: 'Sức khỏe' },
    { value: 'school', label: 'Học tập' },
    { value: 'work', label: 'Công việc' },
    { value: 'home', label: 'Gia đình' },
    { value: 'flight', label: 'Du lịch' }
  ];

  if (!goal) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-zinc-500">Đang tải...</p>
      </div>
    );
  }

  const displayMilestones = isEditing ? editedGoal?.milestones : goal?.milestones;
  const displayTasks = isEditing ? editedGoal?.tasks : goal?.tasks;
  
  const completedMilestones = displayMilestones?.filter(m => m.completed).length || 0;
  const totalMilestones = displayMilestones?.length || 0;
  const completedTasks = displayTasks?.filter(t => t.completed).length || 0;
  const totalTasks = displayTasks?.length || 0;

  return (
    <div className="bg-[#f6f7f8] text-[#111418] font-display overflow-x-hidden min-h-screen flex flex-row">
      {/* Sidebar - Desktop */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          title={goal ? `Quản lý mục tiêu / ${goal.title}` : "Chi tiết mục tiêu"}
          icon="info"
          notifications={notifications}
          onNotificationsChange={setNotifications}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex justify-center py-6 px-4 md:px-8 overflow-y-auto">
          <div className="max-w-[1024px] flex-1 flex flex-col gap-8 w-full">
          {/* Back Button */}
          <button
            onClick={() => navigate('/goals')}
            className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors text-sm font-medium self-start"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            <span>Quay lại danh sách mục tiêu</span>
          </button>

          {/* Goal Header */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-6 bg-background-light p-6 rounded-lg border border-border-light shadow-sm">
            <div className="flex flex-col items-center gap-3 shrink-0">
              <div className="flex items-center justify-center rounded-lg bg-zinc-50 text-zinc-900 border border-zinc-100 size-16">
                <span className="material-symbols-outlined text-4xl">{isEditing ? editedGoal.icon : goal.icon}</span>
              </div>
              {isEditing && (
                <div className="flex flex-wrap gap-2 justify-center max-w-[200px]">
                  {iconOptions.map((icon) => (
                    <button
                      key={icon.value}
                      type="button"
                      onClick={() => handleFieldChange('icon', icon.value)}
                      className={`flex items-center justify-center size-10 rounded-lg border transition-all ${
                        (isEditing ? editedGoal.icon : goal.icon) === icon.value
                          ? 'bg-zinc-900 border-zinc-900 text-white'
                          : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50'
                      }`}
                      title={icon.label}
                    >
                      <span className="material-symbols-outlined text-xl">{icon.value}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editedGoal.title}
                        onChange={(e) => handleFieldChange('title', e.target.value)}
                        className="w-full text-2xl font-semibold text-zinc-900 bg-white border border-zinc-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={editedGoal.category}
                          onChange={(e) => handleFieldChange('category', e.target.value)}
                          className="w-full text-sm text-zinc-500 bg-white border border-zinc-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                          placeholder="Danh mục"
                        />
                        <input
                          type="date"
                          value={editedGoal.dueDate.split('/').reverse().join('-')}
                          onChange={(e) => {
                            const date = new Date(e.target.value);
                            const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
                            handleFieldChange('dueDate', formattedDate);
                          }}
                          className="w-full text-sm text-zinc-500 bg-white border border-zinc-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-2xl font-semibold text-zinc-900 mb-1">{goal.title}</h2>
                      <p className="text-zinc-500 text-sm">{goal.category} • Đến hạn: {goal.dueDate}</p>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors"
                        aria-label="Save changes"
                      >
                        Lưu
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 bg-white text-zinc-900 text-sm font-medium rounded-lg border border-zinc-300 hover:bg-zinc-50 transition-colors"
                        aria-label="Cancel editing"
                      >
                        Hủy
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleEdit}
                      className="p-2 text-zinc-300 hover:text-zinc-600 transition-colors rounded-full hover:bg-zinc-100"
                      aria-label="Edit goal"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>edit</span>
                    </button>
                  )}
                </div>
              </div>
              {isEditing ? (
                <textarea
                  value={editedGoal.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  className="w-full mt-3 text-sm text-zinc-600 bg-white border border-zinc-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-900 resize-none min-h-[80px] leading-relaxed"
                  placeholder="Mô tả mục tiêu..."
                />
              ) : (
                <p className="text-zinc-600 text-sm leading-relaxed mt-3">{goal.description}</p>
              )}
              <div className="mt-4 flex items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-semibold text-zinc-400 tracking-wider mb-1">Tiến độ tổng thể</span>
                  <div className="flex items-center gap-3">
                    {isEditing ? (
                      <div className="flex items-center gap-3">
                        <div className="w-48 h-2 rounded-full bg-zinc-100 overflow-hidden">
                          <div 
                            className="h-full rounded-full bg-zinc-800 transition-all duration-300" 
                            style={{ width: `${editedGoal.progress}%` }}
                            role="progressbar"
                            aria-valuenow={editedGoal.progress}
                            aria-valuemin="0"
                            aria-valuemax="100"
                          />
                        </div>
                        <span className="text-sm font-bold text-zinc-900">{editedGoal.progress}%</span>
                        <span className="text-xs text-zinc-400">(tự động)</span>
                      </div>
                    ) : (
                      <>
                        <div className="w-48 h-2 rounded-full bg-zinc-100 overflow-hidden">
                          <div 
                            className="h-full rounded-full bg-zinc-800 transition-all duration-300" 
                            style={{ width: `${goal.progress}%` }}
                            role="progressbar"
                            aria-valuenow={goal.progress}
                            aria-valuemin="0"
                            aria-valuemax="100"
                          />
                        </div>
                        <span className="text-sm font-bold text-zinc-900">{goal.progress}%</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2 p-4 bg-background-light border border-border-light rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 text-sm font-medium">Mốc quan trọng</span>
                <span className={`material-symbols-outlined ${totalMilestones > 0 && completedMilestones === totalMilestones ? 'text-red-500' : 'text-zinc-400'}`} style={{ fontSize: '20px' }}>flag</span>
              </div>
              <p className="text-2xl font-light text-zinc-900">{completedMilestones}/{totalMilestones}</p>
              <p className="text-xs text-zinc-400">đã hoàn thành</p>
            </div>
            <div className="flex flex-col gap-2 p-4 bg-background-light border border-border-light rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 text-sm font-medium">Nhiệm vụ</span>
                <span className={`material-symbols-outlined ${totalTasks > 0 && completedTasks === totalTasks ? 'text-green-500' : 'text-zinc-400'}`} style={{ fontSize: '20px' }}>check_circle</span>
              </div>
              <p className="text-2xl font-light text-zinc-900">{completedTasks}/{totalTasks}</p>
              <p className="text-xs text-zinc-400">đã hoàn thành</p>
            </div>
          </div>

          {/* Milestones Section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-zinc-900">Mốc quan trọng</h3>
              {isEditing && (
                <button
                  onClick={handleAddMilestone}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-zinc-900 bg-white border border-zinc-300 rounded-lg hover:bg-zinc-50 transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">add</span>
                  <span>Thêm mốc</span>
                </button>
              )}
            </div>
            <div className="flex flex-col gap-3">
              {(isEditing ? editedGoal.milestones : goal.milestones).map((milestone, index) => {
                const currentMilestone = milestone;
                return (
                  <div
                    key={milestone.id}
                    className="flex items-start gap-4 p-4 bg-background-light border border-border-light rounded-lg hover:border-zinc-300 transition-colors"
                  >
                    <div className="flex flex-col items-center shrink-0">
                      {isEditing ? (
                        <button
                          onClick={() => handleMilestoneToggle(milestone.id)}
                          className={`size-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                            currentMilestone.completed 
                              ? 'bg-zinc-900 border-zinc-900 text-white hover:bg-zinc-800' 
                              : 'bg-white border-zinc-300 text-zinc-400 hover:border-zinc-400'
                          }`}
                        >
                          {currentMilestone.completed ? (
                            <span className="material-symbols-outlined text-sm">check</span>
                          ) : (
                            <span className="text-xs font-bold">{index + 1}</span>
                          )}
                        </button>
                      ) : (
                        <div className={`size-8 rounded-full flex items-center justify-center border-2 ${
                          milestone.completed 
                            ? 'bg-zinc-900 border-zinc-900 text-white' 
                            : 'bg-white border-zinc-300 text-zinc-400'
                        }`}>
                          {milestone.completed ? (
                            <span className="material-symbols-outlined text-sm">check</span>
                          ) : (
                            <span className="text-xs font-bold">{index + 1}</span>
                          )}
                        </div>
                      )}
                       {index < (isEditing ? editedGoal.milestones : goal.milestones).length - 1 && (
                         <div className={`w-0.5 h-8 mt-2 ${
                           currentMilestone.completed ? 'bg-zinc-900' : 'bg-zinc-200'
                         }`} />
                       )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          {isEditing ? (
                            <div className="space-y-2">
                              <input
                                type="text"
                                value={currentMilestone.title}
                                onChange={(e) => {
                                  setEditedGoal(prev => ({
                                    ...prev,
                                    milestones: prev.milestones.map(m => 
                                      m.id === milestone.id ? { ...m, title: e.target.value } : m
                                    )
                                  }));
                                }}
                                className="w-full text-sm font-medium text-zinc-900 bg-white border border-zinc-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                                placeholder="Tên mốc quan trọng"
                              />
                              <input
                                type="date"
                                value={currentMilestone.date.split('/').reverse().join('-')}
                                onChange={(e) => {
                                  const date = new Date(e.target.value);
                                  const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
                                  setEditedGoal(prev => ({
                                    ...prev,
                                    milestones: prev.milestones.map(m => 
                                      m.id === milestone.id ? { ...m, date: formattedDate } : m
                                    )
                                  }));
                                }}
                                className="w-full text-xs text-zinc-400 bg-white border border-zinc-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                              />
                            </div>
                          ) : (
                            <div>
                              <p className={`text-sm font-medium ${milestone.completed ? 'text-zinc-500 line-through' : 'text-zinc-900'}`}>
                                {milestone.title}
                              </p>
                              <p className="text-xs text-zinc-400 mt-1">{milestone.date}</p>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {!isEditing && milestone.completed && (
                            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">Hoàn thành</span>
                          )}
                          {isEditing && (
                            <button
                              onClick={() => handleDeleteMilestone(milestone.id)}
                              className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                              aria-label={`Xóa mốc: ${milestone.title}`}
                            >
                              <span className="material-symbols-outlined text-lg">delete</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tasks Section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-zinc-900">Nhiệm vụ liên quan</h3>
              {isEditing && (
                <button
                  onClick={handleAddTask}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-zinc-900 bg-white border border-zinc-300 rounded-lg hover:bg-zinc-50 transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">add</span>
                  <span>Thêm nhiệm vụ</span>
                </button>
              )}
            </div>
             <div className="flex flex-col gap-2">
               {(isEditing ? editedGoal.tasks : goal.tasks).map((task) => {
                 const currentTask = task;
                return (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 bg-background-light border border-border-light rounded-lg hover:border-zinc-300 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={currentTask.completed}
                      onChange={() => isEditing && handleTaskToggle(task.id)}
                      disabled={!isEditing}
                      className="h-5 w-5 cursor-pointer rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 disabled:cursor-not-allowed"
                    />
                    {isEditing ? (
                      <div className="flex-1 flex flex-col gap-2">
                        <input
                          type="text"
                          value={currentTask.text}
                          onChange={(e) => {
                            setEditedGoal(prev => ({
                              ...prev,
                              tasks: prev.tasks.map(t => 
                                t.id === task.id ? { ...t, text: e.target.value } : t
                              )
                            }));
                          }}
                          className="w-full text-sm text-zinc-900 bg-white border border-zinc-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                          placeholder="Nhập nhiệm vụ..."
                        />
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-zinc-400 text-[16px] pointer-events-none">event</span>
                          <input
                            type="date"
                            value={currentTask.date ? currentTask.date.split('/').reverse().join('-') : ''}
                            onChange={(e) => {
                              const date = new Date(e.target.value);
                              const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
                              setEditedGoal(prev => ({
                                ...prev,
                                tasks: prev.tasks.map(t => 
                                  t.id === task.id ? { ...t, date: formattedDate } : t
                                )
                              }));
                            }}
                            className="w-full text-xs text-zinc-400 bg-white border border-zinc-300 rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-900 cursor-pointer"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${task.completed ? 'text-zinc-400 line-through' : 'text-zinc-900'}`}>
                          {task.text}
                        </p>
                        {task.date && (
                          <p className="text-xs text-zinc-400 mt-1">{task.date}</p>
                        )}
                      </div>
                    )}
                    {isEditing && (
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                        aria-label={`Xóa nhiệm vụ: ${task.text}`}
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      </div>

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
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-[#111418] font-medium transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="material-symbols-outlined">today</span>
            <span>Kế hoạch hôm nay</span>
          </Link>
          <Link 
            to="/goals" 
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-blue-50 text-primary font-medium transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="material-symbols-outlined fill-1">target</span>
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

export default GoalDetailPage;

