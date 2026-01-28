// 全局变量
let courses = [];
let classTimes = [];
let uploadedImage = null;

// 默认课程时间配置
const defaultClassTimes = [
    { start: "08:30", end: "09:15" },
    { start: "09:20", end: "10:05" },
    { start: "10:20", end: "11:05" },
    { start: "11:10", end: "11:55" },
    { start: "14:30", end: "15:15" },
    { start: "15:20", end: "16:05" },
    { start: "16:20", end: "17:05" },
    { start: "17:10", end: "17:55" },
    { start: "19:30", end: "20:15" },
    { start: "20:20", end: "21:05" },
    { start: "21:10", end: "21:55" }
];

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeClassTimes();
    setupEventListeners();
    
    // 设置默认值
    setDefaultValues();
    
    // 根据设备类型显示不同的按钮文本
    updateButtonTextForDevice();
});

// 初始化课程时间
function initializeClassTimes() {
    classTimes = [...defaultClassTimes];
    updateClassTimesDisplay();
}

// 设置事件监听器
function setupEventListeners() {
    // 课程时间相关
    document.getElementById('classesPerDay').addEventListener('change', updateClassTimesCount);
    document.getElementById('classDuration').addEventListener('change', updateClassTimesDuration);
    document.getElementById('breakDuration').addEventListener('change', updateClassTimesBreak);
    document.getElementById('addClassTime').addEventListener('click', addClassTime);
    
    // 课程相关
    document.getElementById('addCourse').addEventListener('click', addCourse);
    
    // 生成并导入ICS
    document.getElementById('generateAndImportICS').addEventListener('click', generateAndImportICS);
    
    // AI图片识别相关
    setupImageUploadListeners();
    
    // 移动端优化
    optimizeMobileExperience();
    
    // 大学搜索功能
    setupUniversitySearch();
}

// 更新课程时间数量
function updateClassTimesCount() {
    const count = parseInt(document.getElementById('classesPerDay').value) || 11;
    const duration = parseInt(document.getElementById('classDuration').value) || 45;
    const breakDuration = parseInt(document.getElementById('breakDuration').value) || 15;
    
    // 重新生成课程时间
    classTimes = [];
    let currentTime = new Date();
    currentTime.setHours(8, 30, 0, 0); // 8:30开始
    
    for (let i = 0; i < count; i++) {
        const startTime = new Date(currentTime);
        const endTime = new Date(currentTime.getTime() + duration * 60000);
        
        classTimes.push({
            start: formatTime(startTime),
            end: formatTime(endTime)
        });
        
        // 计算下一节课开始时间
        currentTime = new Date(endTime.getTime() + breakDuration * 60000);
        
        // 如果是第4节课后，增加午休时间
        if (i === 3) {
            currentTime.setHours(14, 30, 0, 0);
        }
    }
    
    updateClassTimesDisplay();
}

// 更新课程时长
function updateClassTimesDuration() {
    updateClassTimesCount();
}

// 更新休息时间
function updateClassTimesBreak() {
    updateClassTimesCount();
}

// 格式化时间
function formatTime(date) {
    return date.toTimeString().slice(0, 5);
}

// 解析时间字符串为Date对象
function parseTime(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
}

// 更新课程时间显示
function updateClassTimesDisplay() {
    const container = document.getElementById('classTimes');
    container.innerHTML = '';
    
    classTimes.forEach((time, index) => {
        const timeDiv = document.createElement('div');
        timeDiv.className = 'flex items-center space-x-2';
        timeDiv.innerHTML = `
            <span class="text-sm text-blue-600 font-medium whitespace-nowrap min-w-[3rem]">第${index + 1}节</span>
            <input type="time" value="${time.start}" class="px-3 py-2 border border-blue-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" data-index="${index}" data-type="start">
            <span class="text-gray-500">-</span>
            <input type="time" value="${time.end}" class="px-3 py-2 border border-blue-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" data-index="${index}" data-type="end">
            <button type="button" class="px-3 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors touch-target" onclick="removeClassTime(${index})">删除</button>
        `;
        
        // 添加时间变化监听器
        const startInput = timeDiv.querySelector('[data-type="start"]');
        const endInput = timeDiv.querySelector('[data-type="end"]');
        
        startInput.addEventListener('change', function() {
            classTimes[index].start = this.value;
            updateEndTime(index);
        });
        
        endInput.addEventListener('change', function() {
            classTimes[index].end = this.value;
        });
        
        container.appendChild(timeDiv);
    });
}

// 更新结束时间
function updateEndTime(index) {
    const startTime = parseTime(classTimes[index].start);
    const duration = parseInt(document.getElementById('classDuration').value) || 45;
    const endTime = new Date(startTime.getTime() + duration * 60000);
    classTimes[index].end = formatTime(endTime);
    
    // 更新显示
    const endInput = document.querySelector(`[data-index="${index}"][data-type="end"]`);
    if (endInput) {
        endInput.value = classTimes[index].end;
    }
}

// 添加课程时间
function addClassTime() {
    const lastTime = classTimes[classTimes.length - 1];
    const lastEndTime = parseTime(lastTime.end);
    const breakDuration = parseInt(document.getElementById('breakDuration').value) || 15;
    const duration = parseInt(document.getElementById('classDuration').value) || 45;
    
    const newStartTime = new Date(lastEndTime.getTime() + breakDuration * 60000);
    const newEndTime = new Date(newStartTime.getTime() + duration * 60000);
    
    classTimes.push({
        start: formatTime(newStartTime),
        end: formatTime(newEndTime)
    });
    
    updateClassTimesDisplay();
    document.getElementById('classesPerDay').value = classTimes.length;
}

// 删除课程时间
function removeClassTime(index) {
    classTimes.splice(index, 1);
    updateClassTimesDisplay();
    document.getElementById('classesPerDay').value = classTimes.length;
}

// 添加课程
function addCourse() {
    const courseId = Date.now();
    const course = {
        id: courseId,
        name: '',
        teacher: '',
        timeSlots: [{
            id: Date.now() + 1,
            location: '',
            startWeek: 1,
            endWeek: 16,
            dayOfWeek: 1,
            startClass: 1,
            endClass: 2,
            weekType: 'all' // 'all': 每周, 'odd': 单周, 'even': 双周
        }]
    };
    
    courses.push(course);
    updateCoursesDisplay();
}

// 更新课程显示
function updateCoursesDisplay() {
    const container = document.getElementById('coursesList');
    container.innerHTML = '';
    
    courses.forEach((course, index) => {
        const courseDiv = document.createElement('div');
        courseDiv.className = 'border border-gray-200 rounded-lg p-4 bg-gray-50';
        courseDiv.innerHTML = `
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-medium text-gray-900">课程 ${index + 1}</h3>
                <button type="button" class="text-red-500 hover:text-red-700" onclick="removeCourse(${course.id})">删除课程</button>
            </div>
            
            <!-- 课程基本信息 -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">课程名称</label>
                    <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" 
                           value="${course.name}" onchange="updateCourse(${course.id}, 'name', this.value)" placeholder="例如：概率论与数理统计">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">教师姓名</label>
                    <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" 
                           value="${course.teacher}" onchange="updateCourse(${course.id}, 'teacher', this.value)" placeholder="例如：张老师">
                </div>
            </div>
            
            <!-- 上课时间段 -->
            <div class="mb-4">
                <div class="flex justify-between items-center mb-2">
                    <h4 class="text-md font-medium text-gray-800">上课时间段</h4>
                    <button type="button" class="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600" onclick="addTimeSlot(${course.id})">添加时间段</button>
                </div>
                <div id="timeSlots-${course.id}" class="space-y-3">
                    ${generateTimeSlotsHTML(course)}
                </div>
            </div>
        `;
        container.appendChild(courseDiv);
    });
}

// 生成时间段HTML
function generateTimeSlotsHTML(course) {
    return course.timeSlots.map((timeSlot, index) => `
        <div class="border border-gray-300 rounded-lg p-3 bg-white">
            <div class="flex justify-between items-center mb-2">
                <span class="text-sm font-medium text-gray-700">时间段 ${index + 1}</span>
                ${course.timeSlots.length > 1 ? `<button type="button" class="text-red-500 hover:text-red-700 text-sm" onclick="removeTimeSlot(${course.id}, ${timeSlot.id})">删除</button>` : ''}
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1">上课地点</label>
                    <input type="text" class="w-full px-2 py-1 border border-gray-300 rounded text-sm" 
                           value="${timeSlot.location}" onchange="updateTimeSlot(${course.id}, ${timeSlot.id}, 'location', this.value)" placeholder="例如：立人楼B417">
                </div>
                <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1">上课周数</label>
                    <div class="flex space-x-1">
                        <input type="number" class="w-16 px-1 py-1 border border-gray-300 rounded text-sm" 
                               value="${timeSlot.startWeek}" min="1" onchange="updateTimeSlot(${course.id}, ${timeSlot.id}, 'startWeek', parseInt(this.value))">
                        <span class="text-xs text-gray-500 self-center">-</span>
                        <input type="number" class="w-16 px-1 py-1 border border-gray-300 rounded text-sm" 
                               value="${timeSlot.endWeek}" min="1" onchange="updateTimeSlot(${course.id}, ${timeSlot.id}, 'endWeek', parseInt(this.value))">
                    </div>
                </div>
                <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1">星期几</label>
                    <select class="w-full px-2 py-1 border border-gray-300 rounded text-sm" 
                            onchange="updateTimeSlot(${course.id}, ${timeSlot.id}, 'dayOfWeek', parseInt(this.value))">
                        <option value="1" ${timeSlot.dayOfWeek === 1 ? 'selected' : ''}>星期一</option>
                        <option value="2" ${timeSlot.dayOfWeek === 2 ? 'selected' : ''}>星期二</option>
                        <option value="3" ${timeSlot.dayOfWeek === 3 ? 'selected' : ''}>星期三</option>
                        <option value="4" ${timeSlot.dayOfWeek === 4 ? 'selected' : ''}>星期四</option>
                        <option value="5" ${timeSlot.dayOfWeek === 5 ? 'selected' : ''}>星期五</option>
                        <option value="6" ${timeSlot.dayOfWeek === 6 ? 'selected' : ''}>星期六</option>
                        <option value="7" ${timeSlot.dayOfWeek === 7 ? 'selected' : ''}>星期日</option>
                    </select>
                </div>
                <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1">上课节次</label>
                    <div class="flex space-x-1">
                        <select class="w-16 px-1 py-1 border border-gray-300 rounded text-sm" 
                                onchange="updateTimeSlot(${course.id}, ${timeSlot.id}, 'startClass', parseInt(this.value))">
                            ${classTimes.map((_, i) => `<option value="${i + 1}" ${timeSlot.startClass === i + 1 ? 'selected' : ''}>${i + 1}</option>`).join('')}
                        </select>
                        <span class="text-xs text-gray-500 self-center">-</span>
                        <select class="w-16 px-1 py-1 border border-gray-300 rounded text-sm" 
                                onchange="updateTimeSlot(${course.id}, ${timeSlot.id}, 'endClass', parseInt(this.value))">
                            ${classTimes.map((_, i) => `<option value="${i + 1}" ${timeSlot.endClass === i + 1 ? 'selected' : ''}>${i + 1}</option>`).join('')}
                        </select>
                    </div>
                </div>
                <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1">开课周次</label>
                    <select class="w-full px-2 py-1 border border-gray-300 rounded text-sm" 
                            onchange="updateTimeSlot(${course.id}, ${timeSlot.id}, 'weekType', this.value)">
                        <option value="all" ${timeSlot.weekType === 'all' || !timeSlot.weekType ? 'selected' : ''}>每周</option>
                        <option value="odd" ${timeSlot.weekType === 'odd' ? 'selected' : ''}>单周</option>
                        <option value="even" ${timeSlot.weekType === 'even' ? 'selected' : ''}>双周</option>
                    </select>
                </div>
            </div>
        </div>
    `).join('');
}

// 更新课程信息
function updateCourse(courseId, field, value) {
    const course = courses.find(c => c.id === courseId);
    if (course) {
        course[field] = value;
    }
}

// 添加时间段
function addTimeSlot(courseId) {
    const course = courses.find(c => c.id === courseId);
    if (course) {
        const newTimeSlot = {
            id: Date.now(),
            location: '',
            startWeek: 1,
            endWeek: 16,
            dayOfWeek: 1,
            startClass: 1,
            endClass: 2,
            weekType: 'all' // 'all': 每周, 'odd': 单周, 'even': 双周
        };
        course.timeSlots.push(newTimeSlot);
        updateCoursesDisplay();
    }
}

// 删除时间段
function removeTimeSlot(courseId, timeSlotId) {
    const course = courses.find(c => c.id === courseId);
    if (course && course.timeSlots.length > 1) {
        course.timeSlots = course.timeSlots.filter(ts => ts.id !== timeSlotId);
        updateCoursesDisplay();
    }
}

// 更新时间段信息
function updateTimeSlot(courseId, timeSlotId, field, value) {
    const course = courses.find(c => c.id === courseId);
    if (course) {
        const timeSlot = course.timeSlots.find(ts => ts.id === timeSlotId);
        if (timeSlot) {
            timeSlot[field] = value;
        }
    }
}

// 删除课程
function removeCourse(courseId) {
    courses = courses.filter(c => c.id !== courseId);
    updateCoursesDisplay();
}

// 生成ICS文件
function generateICS() {
    // 验证输入
    if (!validateInputs()) {
        return;
    }
    
    const schoolAddress = document.getElementById('schoolAddress').value;
    const semesterStartDate = document.getElementById('semesterStartDate').value;
    const totalWeeks = parseInt(document.getElementById('totalWeeks').value);
    
    if (!schoolAddress || !semesterStartDate || !totalWeeks) {
        showErrorMessage('请填写完整的学期基本信息！');
        return;
    }
    
    if (courses.length === 0) {
        showErrorMessage('请至少添加一门课程！');
        return;
    }
    
    // 生成ICS内容
    let icsContent = generateICSHeader();
    
    courses.forEach(course => {
        course.timeSlots.forEach(timeSlot => {
            icsContent += generateCourseEvent(course, timeSlot, schoolAddress, semesterStartDate, totalWeeks);
        });
    });
    
    icsContent += 'END:VCALENDAR';
    
    // 存储ICS内容供一键导入使用
    window.currentICSContent = icsContent;
    
    // 下载文件
    downloadICS(icsContent);
    
    // 显示一键导入按钮（仅在Apple设备上）
    if (isAppleDevice()) {
        document.getElementById('importSection').classList.remove('hidden');
        showSuccessMessage('ICS文件生成成功！Apple设备用户可以使用一键导入功能。');
    } else {
        showSuccessMessage('ICS文件生成成功！请下载后导入到您的日历应用中。');
    }
}

// 生成并导入ICS文件（合并后的函数）
function generateAndImportICS() {
    // 验证输入
    if (!validateInputs()) {
        return;
    }
    
    const schoolAddress = document.getElementById('schoolAddress').value;
    const semesterStartDate = document.getElementById('semesterStartDate').value;
    const totalWeeks = parseInt(document.getElementById('totalWeeks').value);
    
    if (!schoolAddress || !semesterStartDate || !totalWeeks) {
        showErrorMessage('请填写完整的学期基本信息！');
        return;
    }
    
    if (courses.length === 0) {
        showErrorMessage('请至少添加一门课程！');
        return;
    }
    
    // 生成ICS内容
    let icsContent = generateICSHeader();
    
    try {
        courses.forEach(course => {
            if (!course.timeSlots || course.timeSlots.length === 0) {
                console.warn(`课程 "${course.name}" 没有时间段信息，跳过`);
                return;
            }
            
            course.timeSlots.forEach(timeSlot => {
                try {
                    icsContent += generateCourseEvent(course, timeSlot, schoolAddress, semesterStartDate, totalWeeks);
                } catch (error) {
                    console.error(`生成课程 "${course.name}" 的事件时出错:`, error);
                    throw new Error(`课程 "${course.name}" 数据有误：${error.message}`);
                }
            });
        });
        
        icsContent += 'END:VCALENDAR';
    } catch (error) {
        console.error('生成ICS文件时出错:', error);
        showErrorMessage(`生成日历文件失败：${error.message}`);
        return;
    }
    
    // 存储ICS内容
    window.currentICSContent = icsContent;
    
    // 所有设备都使用下载方式，这样可以直接弹出日历导入对话框
    downloadICS(icsContent);
    
    // 根据设备显示不同的提示消息
    if (isAppleDevice()) {
        showSuccessMessage('ICS文件已生成！请在下载完成后点击文件导入到日历应用。');
    } else {
        showSuccessMessage('ICS文件生成成功！请下载后导入到您的日历应用中。');
    }
}

// 根据设备类型更新按钮文本
function updateButtonTextForDevice() {
    const appleTexts = document.querySelectorAll('.apple-device-text');
    const otherTexts = document.querySelectorAll('.other-device-text');
    const iosHint = document.getElementById('iosHint');
    
    // 检测iOS设备
    const isiOS = detectiOSSafari();
    
    if (isAppleDevice()) {
        // Apple设备：显示一键导入文本
        appleTexts.forEach(el => el.classList.remove('hidden'));
        otherTexts.forEach(el => el.classList.add('hidden'));
        
        // 如果是iOS Safari，显示特殊提示
        if (isiOS && iosHint) {
            iosHint.classList.remove('hidden');
        }
    } else {
        // 其他设备：显示生成ICS文本
        appleTexts.forEach(el => el.classList.add('hidden'));
        otherTexts.forEach(el => el.classList.remove('hidden'));
        
        // 隐藏iOS提示
        if (iosHint) {
            iosHint.classList.add('hidden');
        }
    }
}

// 验证输入
function validateInputs() {
    const schoolAddress = document.getElementById('schoolAddress').value;
    const semesterStartDate = document.getElementById('semesterStartDate').value;
    const totalWeeks = parseInt(document.getElementById('totalWeeks').value);
    
    if (!schoolAddress.trim()) {
        showErrorMessage('请输入学校地址！');
        return false;
    }
    
    if (!semesterStartDate) {
        showErrorMessage('请选择学期开始日期！');
        return false;
    }
    
    if (!totalWeeks || totalWeeks < 1) {
        showErrorMessage('请输入有效的学期周数！');
        return false;
    }
    
    // 验证课程信息
    for (let i = 0; i < courses.length; i++) {
        const course = courses[i];
        if (!course.name.trim()) {
            showErrorMessage(`请填写第${i + 1}门课程的名称！`);
            return false;
        }
        
        // 验证时间段
        for (let j = 0; j < course.timeSlots.length; j++) {
            const timeSlot = course.timeSlots[j];
            if (!timeSlot.location.trim()) {
                showErrorMessage(`请填写第${i + 1}门课程第${j + 1}个时间段的上课地点！`);
                return false;
            }
            if (timeSlot.startWeek > timeSlot.endWeek) {
                showErrorMessage(`第${i + 1}门课程第${j + 1}个时间段的开始周数不能大于结束周数！`);
                return false;
            }
            if (timeSlot.startClass > timeSlot.endClass) {
                showErrorMessage(`第${i + 1}门课程第${j + 1}个时间段的开始节次不能大于结束节次！`);
                return false;
            }
            if (timeSlot.endWeek > totalWeeks) {
                showErrorMessage(`第${i + 1}门课程第${j + 1}个时间段的结束周数不能超过学期总周数！`);
                return false;
            }
        }
    }
    
    return true;
}

// 生成ICS文件头
function generateICSHeader() {
    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Course Schedule//Course to ICS//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:课程表
X-WR-TIMEZONE:Asia/Shanghai
`;
}

// 获取ICS格式的时间戳
function getICSTimestamp() {
    const now = new Date();
    return now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

// 生成课程事件
function generateCourseEvent(course, timeSlot, schoolAddress, semesterStartDate, totalWeeks) {
    let startDate = new Date(semesterStartDate);
    
    // 修正：确保startDate对齐到该周的周一
    // getDay(): 0=周日, 1=周一, ..., 6=周六
    const day = startDate.getDay();
    // 计算当前日期距离周一的差值（周日视为上一周的最后一天，即差-6天；周一差0天；周二差-1天）
    const diffToMonday = (day === 0 ? -6 : 1) - day;
    startDate.setDate(startDate.getDate() + diffToMonday);

    const dayOfWeek = timeSlot.dayOfWeek; // 1=Monday, 7=Sunday
    const startWeek = timeSlot.startWeek;
    const endWeek = timeSlot.endWeek;
    
    // 计算第一次上课的日期 (基于周一的基础日期)
    const firstClassDate = new Date(startDate);
    const daysToAdd = (startWeek - 1) * 7 + (dayOfWeek - 1);
    firstClassDate.setDate(startDate.getDate() + daysToAdd);
    
    // 验证课程时间数据
    const startClassIndex = timeSlot.startClass - 1;
    const endClassIndex = timeSlot.endClass - 1;
    
    if (startClassIndex < 0 || startClassIndex >= classTimes.length) {
        console.error(`课程 "${course.name}" 的开始节次 ${timeSlot.startClass} 超出范围，当前有 ${classTimes.length} 节课`);
        throw new Error(`课程 "${course.name}" 的开始节次 ${timeSlot.startClass} 超出范围，请检查课程时间配置`);
    }
    
    if (endClassIndex < 0 || endClassIndex >= classTimes.length) {
        console.error(`课程 "${course.name}" 的结束节次 ${timeSlot.endClass} 超出范围，当前有 ${classTimes.length} 节课`);
        throw new Error(`课程 "${course.name}" 的结束节次 ${timeSlot.endClass} 超出范围，请检查课程时间配置`);
    }
    
    // 计算课程时间
    const startClassTime = classTimes[startClassIndex];
    const endClassTime = classTimes[endClassIndex];
    
    if (!startClassTime || !startClassTime.start) {
        console.error(`课程 "${course.name}" 的开始时间数据无效:`, startClassTime);
        throw new Error(`课程 "${course.name}" 的开始时间数据无效，请检查课程时间配置`);
    }
    
    if (!endClassTime || !endClassTime.end) {
        console.error(`课程 "${course.name}" 的结束时间数据无效:`, endClassTime);
        throw new Error(`课程 "${course.name}" 的结束时间数据无效，请检查课程时间配置`);
    }
    
    const startTime = `${formatDateForICS(firstClassDate)}T${startClassTime.start.replace(':', '')}00`;
    const endTime = `${formatDateForICS(firstClassDate)}T${endClassTime.end.replace(':', '')}00`;
    
    // 获取周次类型（默认每周）
    const weekType = timeSlot.weekType || 'all';
    
    // 计算重复次数
    const repeatCount = endWeek - startWeek;
    
    // 生成事件
    const eventId = generateEventId();
    const summary = `${course.name}@${timeSlot.location}`;
    const location = `${schoolAddress}${timeSlot.location}`;
    const description = `教师：${course.teacher || '未指定'}`;
    
    let event = `BEGIN:VEVENT
UID:${eventId}
DTSTAMP:${getICSTimestamp()}
DTSTART:${startTime}
DTEND:${endTime}
SUMMARY:${summary}
LOCATION:${location}
DESCRIPTION:${description}
`;
    
    // 根据周次类型生成RRULE和EXDATE
    if (weekType === 'all') {
        // 每周：使用简单的RRULE
        event += `RRULE:FREQ=WEEKLY;COUNT=${repeatCount + 1}
`;
    } else {
        // 单周或双周：需要排除不需要的周次
        // 学期第一周是单周，所以：
        // 单周：1, 3, 5, 7, 9, ... (奇数周)
        // 双周：2, 4, 6, 8, 10, ... (偶数周)
        
        // 先使用RRULE生成所有周次的事件
        event += `RRULE:FREQ=WEEKLY;COUNT=${repeatCount + 1}
`;
        
        // 计算需要排除的日期
        const excludeDates = [];
        for (let week = startWeek; week <= endWeek; week++) {
            const isOddWeek = (week % 2 === 1);
            
            // 如果是单周课程，排除双周
            if (weekType === 'odd' && !isOddWeek) {
                const excludeDate = new Date(startDate);
                const daysToAdd = (week - 1) * 7 + (dayOfWeek - 1);
                excludeDate.setDate(startDate.getDate() + daysToAdd);
                excludeDates.push(excludeDate);
            }
            // 如果是双周课程，排除单周
            else if (weekType === 'even' && isOddWeek) {
                const excludeDate = new Date(startDate);
                const daysToAdd = (week - 1) * 7 + (dayOfWeek - 1);
                excludeDate.setDate(startDate.getDate() + daysToAdd);
                excludeDates.push(excludeDate);
            }
        }
        
        // 添加EXDATE排除不需要的日期
        if (excludeDates.length > 0) {
            // 为每个日期创建单独的EXDATE行，提高兼容性
            excludeDates.forEach(date => {
                const dateStr = formatDateForICS(date);
                const timeStr = startClassTime.start.replace(':', '') + '00';
                event += `EXDATE:${dateStr}T${timeStr}
`;
            });
        }
    }
    
    // 添加提醒
    const reminders = [
        { id: 'reminder1', trigger: '-PT1H', desc: '课前1小时提醒' },
        { id: 'reminder2', trigger: '-PT30M', desc: '课前30分钟提醒' },
        { id: 'reminder3', trigger: '-PT15M', desc: '课前15分钟提醒' },
        { id: 'reminder4', trigger: '-PT5M', desc: '课前5分钟提醒' },
        { id: 'reminder5', trigger: '-PT1M', desc: '课前1分钟提醒' }
    ];
    
    reminders.forEach(reminder => {
        if (document.getElementById(reminder.id).checked) {
            event += `BEGIN:VALARM
TRIGGER:${reminder.trigger}
ACTION:DISPLAY
DESCRIPTION:${reminder.desc}
END:VALARM
`;
        }
    });
    
    event += `END:VEVENT
`;
    
    return event;
}

// 格式化日期为ICS格式
function formatDateForICS(date) {
    return date.toISOString().slice(0, 10).replace(/-/g, '');
}

// 生成事件ID
function generateEventId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}@coursetools.com`;
}

// 设置默认值
function setDefaultValues() {
    // 设置默认学期开始日期为当前日期
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    document.getElementById('semesterStartDate').value = `${year}-${month}-${day}`;
    
    // 设置默认总周数
    document.getElementById('totalWeeks').value = '16';
}

// 下载ICS文件
function downloadICS(content) {
    // 检测iOS Safari
    const isiOSSafari = detectiOSSafari();
    
    if (isiOSSafari) {
        // iOS Safari特殊处理
        downloadICSForiOS(content);
    } else {
        // 其他浏览器标准处理
        downloadICSStandard(content);
    }
}

// 检测iOS Safari浏览器
function detectiOSSafari() {
    const userAgent = navigator.userAgent;
    const isiOS = /iPhone|iPad|iPod/.test(userAgent);
    const isSafari = /Safari/.test(userAgent);
    const isNotChrome = !/Chrome|CriOS|FxiOS|EdgiOS/.test(userAgent);
    
    return isiOS && isSafari && isNotChrome;
}

// iOS Safari专用下载方法
function downloadICSForiOS(content) {
    try {
        // 方法1: 使用data URI
        const dataURI = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(content);
        
        // 创建隐藏的链接
        const link = document.createElement('a');
        link.href = dataURI;
        link.download = '课程表.ics';
        link.style.display = 'none';
        
        // 必须添加到DOM中才能在iOS Safari中工作
        document.body.appendChild(link);
        
        // 使用用户手势触发下载
        setTimeout(() => {
            try {
                link.click();
                
                // 清理DOM
                setTimeout(() => {
                    if (document.body.contains(link)) {
                        document.body.removeChild(link);
                    }
                }, 1000);
                
                showSuccessMessage('ICS文件已生成！请在Safari下载管理器中查看并点击文件导入到日历。');
                
                // 延迟显示iOS使用说明
                setTimeout(() => {
                    showIOSInstructions();
                }, 2000);
                
            } catch (downloadError) {
                console.warn('iOS Safari下载失败，尝试备用方案:', downloadError);
                // 备用方案：使用window.open
                try {
                    window.open(dataURI, '_blank');
                    showSuccessMessage('ICS文件已在新窗口中打开，请保存并导入到日历应用。');
                } catch (error) {
                    console.error('所有iOS下载方法都失败:', error);
                    showICSCopyOption(content);
                }
            }
        }, 100);
        
    } catch (error) {
        console.error('iOS Safari处理失败:', error);
        showICSCopyOption(content);
    }
}

// 标准浏览器下载方法
function downloadICSStandard(content) {
    try {
        const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = '课程表.ics';
        link.type = 'text/calendar';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        showSuccessMessage('ICS文件生成成功！请下载后导入到您的日历应用中。');
    } catch (error) {
        console.error('标准下载失败:', error);
        showErrorMessage('文件下载失败，请重试。');
    }
}

// 显示iOS使用说明
function showIOSInstructions() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 class="text-lg font-semibold text-primary mb-4">📱 iOS导入说明</h3>
            <div class="space-y-3 text-sm text-gray-700">
                <div class="flex items-start space-x-2">
                    <span class="text-primary font-bold min-w-[1.5rem]">1.</span>
                    <span>在Safari下载管理器中找到"课程表.ics"文件</span>
                </div>
                <div class="flex items-start space-x-2">
                    <span class="text-primary font-bold min-w-[1.5rem]">2.</span>
                    <span>点击文件，选择"用日历打开"</span>
                </div>
                <div class="flex items-start space-x-2">
                    <span class="text-primary font-bold min-w-[1.5rem]">3.</span>
                    <span>在日历应用中确认导入课程表</span>
                </div>
            </div>
            <div class="mt-4 p-3 bg-blue-50 rounded-lg">
                <p class="text-xs text-blue-700">
                    💡 提示：如果没有看到下载，请检查Safari的下载设置，或尝试长按链接选择"下载链接的文件"
                </p>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" 
                    class="mt-4 w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                我知道了
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 点击背景关闭
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// 显示复制选项（最后的备用方案）
function showICSCopyOption(content) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-lg w-full max-h-96 overflow-hidden">
            <h3 class="text-lg font-semibold text-primary mb-4">📋 手动导入课程表</h3>
            <p class="text-sm text-gray-600 mb-4">
                由于浏览器限制，请复制以下内容并通过其他方式导入：
            </p>
            <div class="mb-4">
                <textarea id="icsContentCopy" class="w-full h-32 p-2 border border-gray-300 rounded text-xs font-mono resize-none" readonly>${content}</textarea>
            </div>
            <div class="flex space-x-3 mb-3">
                <button onclick="copyICSContent()" class="flex-1 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors">
                    📋 复制内容
                </button>
                <button onclick="this.parentElement.parentElement.parentElement.remove()" class="flex-1 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors">
                    关闭
                </button>
            </div>
            <div class="text-xs text-gray-500 space-y-1">
                <p>💡 复制后可以：</p>
                <p>• 通过AirDrop发送给自己</p>
                <p>• 粘贴到备忘录并保存为.ics文件</p>
                <p>• 发送邮件给自己并保存附件</p>
                <p>• 使用其他浏览器（如Chrome）访问本页面</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 全局函数用于复制
    window.copyICSContent = function() {
        const textarea = document.getElementById('icsContentCopy');
        textarea.select();
        textarea.setSelectionRange(0, 99999);
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showSuccessMessage('内容已复制到剪贴板！');
            } else {
                throw new Error('复制命令失败');
            }
        } catch (error) {
            console.error('复制失败:', error);
            showErrorMessage('复制失败，请手动选择文本复制。');
        }
    };
    
    // 点击背景关闭
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
            // 清理全局函数
            delete window.copyICSContent;
        }
    });
}

// 显示成功消息
function showSuccessMessage(message) {
    showToast(message, 'bg-green-500');
}

// 显示错误消息
function showErrorMessage(message) {
    showToast(message, 'bg-red-500');
}

// 显示提示消息
function showToast(message, bgColor) {
    // 创建提示框
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-x-full`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // 显示动画
    setTimeout(() => {
        toast.classList.remove('translate-x-full');
    }, 100);
    
    // 3秒后自动消失
    setTimeout(() => {
        toast.classList.add('translate-x-full');
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// ==================== AI图片识别功能 ====================

// 设置图片上传监听器
function setupImageUploadListeners() {
    const dropZone = document.getElementById('dropZone');
    const imageUpload = document.getElementById('imageUpload');
    const analyzeButton = document.getElementById('analyzeImage');
    const removeButton = document.getElementById('removeImage');
    
    // 点击上传 - 只在占位符区域点击时触发
    const uploadPlaceholder = document.getElementById('uploadPlaceholder');
    uploadPlaceholder.addEventListener('click', (e) => {
        e.stopPropagation();
        imageUpload.click();
    });
    
    // 文件选择
    imageUpload.addEventListener('change', handleFileSelect);
    
    // 拖拽上传
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('drop', handleDrop);
    
    // 分析图片
    analyzeButton.addEventListener('click', (e) => {
        e.stopPropagation();
        analyzeImage();
    });
    
    // 移除图片
    removeButton.addEventListener('click', (e) => {
        e.stopPropagation();
        removeImage();
    });
}

// 处理文件选择
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        processImageFile(file);
    }
}

// 处理拖拽悬停
function handleDragOver(event) {
    event.preventDefault();
    event.currentTarget.classList.add('border-primary', 'bg-blue-50');
}

// 处理拖拽放置
function handleDrop(event) {
    event.preventDefault();
    event.currentTarget.classList.remove('border-primary', 'bg-blue-50');
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        processImageFile(files[0]);
    }
}

// 处理图片文件
function processImageFile(file) {
    if (!file.type.startsWith('image/')) {
        showErrorMessage('请选择图片文件！');
        return;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB限制
        showErrorMessage('图片文件过大，请选择小于10MB的图片！');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        uploadedImage = e.target.result;
        showImagePreview(uploadedImage);
    };
    reader.readAsDataURL(file);
}

// 显示图片预览
function showImagePreview(imageData) {
    const placeholder = document.getElementById('uploadPlaceholder');
    const preview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    
    // 隐藏占位符，显示图片预览
    placeholder.classList.add('hidden');
    previewImg.src = imageData;
    preview.classList.remove('hidden');
    
    updateAIStatus('ready', '图片已上传，点击"开始识别"按钮进行AI分析');
}

// 移除图片
function removeImage() {
    uploadedImage = null;
    const placeholder = document.getElementById('uploadPlaceholder');
    const preview = document.getElementById('imagePreview');
    
    // 显示占位符，隐藏图片预览
    placeholder.classList.remove('hidden');
    preview.classList.add('hidden');
    document.getElementById('imageUpload').value = '';
    updateAIStatus('idle', '请上传课表图片开始AI识别');
}

// 更新AI状态显示
function updateAIStatus(status, message) {
    const statusDiv = document.getElementById('aiStatus');
    
    switch (status) {
        case 'idle':
            statusDiv.innerHTML = `
                <div class="text-center text-gray-500">
                    <svg class="mx-auto h-12 w-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p class="text-sm">${message}</p>
                </div>
            `;
            break;
        case 'ready':
            statusDiv.innerHTML = `
                <div class="text-center text-blue-600">
                    <svg class="mx-auto h-12 w-12 text-blue-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                    <p class="text-sm">${message}</p>
                </div>
            `;
            break;
        case 'analyzing':
            statusDiv.innerHTML = `
                <div class="text-center text-blue-600">
                    <div class="mx-auto h-12 w-12 mb-2">
                        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                    <p class="text-sm">${message}</p>
                </div>
            `;
            break;
        case 'success':
            statusDiv.innerHTML = `
                <div class="text-center text-green-600">
                    <svg class="mx-auto h-12 w-12 text-green-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <p class="text-sm">${message}</p>
                </div>
            `;
            break;
        case 'error':
            statusDiv.innerHTML = `
                <div class="text-center text-red-600">
                    <svg class="mx-auto h-12 w-12 text-red-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    <p class="text-sm">${message}</p>
                </div>
            `;
            break;
    }
}

// 更新模型选项
function updateModelOptions() {
    const selectedProvider = document.querySelector('input[name="apiProvider"]:checked').value;
    const modelSelect = document.getElementById('modelSelect');
    const apiKeyInput = document.getElementById('apiKey');
    
    // 清空现有选项
    modelSelect.innerHTML = '';
    
    if (selectedProvider === 'openai') {
        // OpenAI模型选项
        const openaiModels = [
            { value: 'gpt-4o', text: 'GPT-4o (推荐)' },
            { value: 'gpt-4o-mini', text: 'GPT-4o Mini (经济)' },
            { value: 'gpt-4-turbo', text: 'GPT-4 Turbo' }
        ];
        
        openaiModels.forEach(model => {
            const option = document.createElement('option');
            option.value = model.value;
            option.textContent = model.text;
            modelSelect.appendChild(option);
        });
        
        apiKeyInput.placeholder = 'sk-...';
    } else if (selectedProvider === 'deepseek') {
        // DeepSeek模型选项
        const deepseekModels = [
            { value: 'deepseek-vl', text: 'DeepSeek-VL (推荐)' },
            { value: 'deepseek-chat', text: 'DeepSeek-Chat' }
        ];
        
        deepseekModels.forEach(model => {
            const option = document.createElement('option');
            option.value = model.value;
            option.textContent = model.text;
            modelSelect.appendChild(option);
        });
        
        apiKeyInput.placeholder = 'sk-...';
    } else if (selectedProvider === 'qwen') {
        // Qwen模型选项
        const qwenModels = [
            { value: 'qwen-vl-max', text: 'Qwen-VL-Max (推荐)' },
            { value: 'qwen-vl-plus', text: 'Qwen-VL-Plus' },
            { value: 'qwen-max', text: 'Qwen-Max' }
        ];
        
        qwenModels.forEach(model => {
            const option = document.createElement('option');
            option.value = model.value;
            option.textContent = model.text;
            modelSelect.appendChild(option);
        });
        
        apiKeyInput.placeholder = 'sk-...';
    }
}

// 分析图片
async function analyzeImage() {
    if (!uploadedImage) {
        showErrorMessage('请先上传图片！');
        return;
    }
    
    updateAIStatus('analyzing', 'AI正在分析课表图片，请稍候...');
    
    try {
        // 调用代理API
        const result = await callProxyAPI(uploadedImage);
        
        if (result.success) {
            parseAndFillData(result.data);
            updateAIStatus('success', '识别完成！数据已自动填充到表单中，请检查并调整。');
            showSuccessMessage('AI识别完成！请检查并调整识别结果。');
        } else {
            throw new Error(result.error || '识别失败');
        }
    } catch (error) {
        console.error('AI识别错误:', error);
        updateAIStatus('error', `识别失败：${error.message}`);
        showErrorMessage(`AI识别失败：${error.message}`);
    }
}

// 调用OpenAI API
async function callOpenAIAPI(apiKey, model, imageData) {
    const prompt = `请分析这张课表图片，提取出所有课程信息，并按照以下JSON格式返回：

{
  "courses": [
    {
      "name": "课程名称",
      "teacher": "教师姓名",
      "timeSlots": [
        {
          "location": "上课地点",
          "startWeek": 1,
          "endWeek": 16,
          "dayOfWeek": 1,
          "startClass": 1,
          "endClass": 2,
          "weekType": "all"
        }
      ]
    }
  ]
}

注意：
1. dayOfWeek: 1=星期一, 2=星期二, ..., 7=星期日
2. startClass和endClass: 第几节课（从1开始）
3. 如果同一门课程在不同周次有不同安排，请为每个时间段创建单独的timeSlot
4. 请仔细识别所有课程信息，包括课程名称、教师、地点、时间等
5. 只返回JSON格式，不要包含其他文字
6. 不要提取学期信息或课程时间配置，这些需要用户手动输入
7. weekType字段：如果课程标注了"单周"、"单"、"奇数周"等，设置为"odd"；如果标注了"双周"、"双"、"偶数周"等，设置为"even"；如果没有标注或标注了"每周"、"全周"等，设置为"all"（默认值）`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: model,
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: prompt
                        },
                        {
                            type: 'image_url',
                            image_url: {
                                url: imageData
                            }
                        }
                    ]
                }
            ],
            max_tokens: 4000,
            temperature: 0.1
        })
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `API请求失败: ${response.status}`);
    }
    
    const data = await response.json();
    const content = data.choices[0].message.content;
    
    try {
        // 尝试提取JSON
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('无法从响应中提取JSON数据');
        }
        
        const jsonData = JSON.parse(jsonMatch[0]);
        return { success: true, data: jsonData };
    } catch (parseError) {
        throw new Error('AI返回的数据格式不正确，请重试');
    }
}

// 调用DeepSeek API
async function callDeepSeekAPI(apiKey, model, imageData) {
    const prompt = `请分析这张课表图片，提取出所有课程信息，并按照以下JSON格式返回：

{
  "courses": [
    {
      "name": "课程名称",
      "teacher": "教师姓名",
      "timeSlots": [
        {
          "location": "上课地点",
          "startWeek": 1,
          "endWeek": 16,
          "dayOfWeek": 1,
          "startClass": 1,
          "endClass": 2,
          "weekType": "all"
        }
      ]
    }
  ]
}

注意：
1. dayOfWeek: 1=星期一, 2=星期二, ..., 7=星期日
2. startClass和endClass: 第几节课（从1开始）
3. 如果同一门课程在不同周次有不同安排，请为每个时间段创建单独的timeSlot
4. 请仔细识别所有课程信息，包括课程名称、教师、地点、时间等
5. 只返回JSON格式，不要包含其他文字
6. 不要提取学期信息或课程时间配置，这些需要用户手动输入
7. weekType字段：如果课程标注了"单周"、"单"、"奇数周"等，设置为"odd"；如果标注了"双周"、"双"、"偶数周"等，设置为"even"；如果没有标注或标注了"每周"、"全周"等，设置为"all"（默认值）`;

    // 根据模型选择不同的API端点
    let apiUrl, requestBody;
    
    if (model === 'deepseek-vl') {
        // DeepSeek-VL API
        apiUrl = 'https://api.deepseek.com/v1/chat/completions';
        requestBody = {
            model: 'deepseek-vl',
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: prompt
                        },
                        {
                            type: 'image_url',
                            image_url: {
                                url: imageData
                            }
                        }
                    ]
                }
            ],
            max_tokens: 4000,
            temperature: 0.1
        };
    } else {
        // DeepSeek-Chat API (不支持图片，需要先转换)
        apiUrl = 'https://api.deepseek.com/v1/chat/completions';
        requestBody = {
            model: 'deepseek-chat',
            messages: [
                {
                    role: 'user',
                    content: prompt + '\n\n注意：由于当前模型不支持图片识别，请根据常见的课表格式进行推断。'
                }
            ],
            max_tokens: 4000,
            temperature: 0.1
        };
    }

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `API请求失败: ${response.status}`);
    }
    
    const data = await response.json();
    const content = data.choices[0].message.content;
    
    try {
        // 尝试提取JSON
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('无法从响应中提取JSON数据');
        }
        
        const jsonData = JSON.parse(jsonMatch[0]);
        return { success: true, data: jsonData };
    } catch (parseError) {
        throw new Error('AI返回的数据格式不正确，请重试');
    }
}

// 调用代理API（智能选择方式）
async function callProxyAPI(imageData) {
    try {
        if (window.location.hostname.includes('github.io')) {
            // GitHub Pages - 直接调用AI API
            console.log('GitHub Pages环境，直接调用AI API');
            return await callQwenAPIDirect(imageData);
        } else if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            // 本地开发环境 - 使用代理
            console.log('本地开发环境，使用代理API');
            return await callVercelProxy(imageData, 'http://localhost:3000/api/analyze-schedule');
        } else {
            // Vercel或其他支持Serverless的平台 - 使用代理
            console.log('Vercel环境，使用Serverless函数');
            return await callVercelProxy(imageData, '/api/analyze-schedule');
        }
    } catch (error) {
        console.error('API调用错误:', error);
        throw error;
    }
}

// Vercel代理调用
async function callVercelProxy(imageData, apiUrl) {
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            image: imageData,
            model: 'qwen-vl-max'
        })
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('代理API错误响应:', errorData);
        throw new Error(errorData.error || `代理API请求失败: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
}

// 直接调用Qwen API（用于GitHub Pages）
async function callQwenAPIDirect(imageData) {
    // 获取API Key（从GitHub Actions注入的环境变量）
    const apiKey = getApiKey();
    if (!apiKey) {
        throw new Error('API Key未配置，请联系管理员');
    }
    
    const requestBody = {
        model: 'qwen-vl-max',
        messages: [{
            role: 'user',
            content: [
                {
                    type: 'image_url',
                    image_url: { url: imageData }
                },
                {
                    type: 'text',
                    text: `请分析这张课表图片，提取出所有课程信息。请严格按照以下JSON格式返回，不要包含任何其他文字：

{
  "courses": [
    {
      "name": "课程名称",
      "teacher": "教师姓名",
      "timeSlots": [
        {
          "location": "上课地点",
          "startWeek": 开始周数,
          "endWeek": 结束周数,
          "dayOfWeek": 星期几(1-7),
          "startClass": 开始节次,
          "endClass": 结束节次,
          "weekType": "all"
        }
      ]
    }
  ]
}

注意事项：
1. 星期一=1, 星期二=2, ..., 星期日=7
2. 节次从1开始计数
3. 如果同一门课程在不同时间段上课，请在timeSlots数组中添加多个时间段
4. 确保所有数字都是整数类型
5. 如果某些信息无法识别，请用合理的默认值
6. 不要提取学期信息或课程时间配置，这些需要用户手动输入
7. weekType字段：如果课程标注了"单周"、"单"、"奇数周"等，设置为"odd"；如果标注了"双周"、"双"、"偶数周"等，设置为"even"；如果没有标注或标注了"每周"、"全周"等，设置为"all"（默认值）`
                }
            ]
        }]
    };

    console.log('直接调用Qwen API');
    
    const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Qwen API错误响应:', errorData);
        throw new Error(errorData.error?.message || `Qwen API请求失败: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    console.log('Qwen API原始响应:', content);
    
    try {
        // 清理响应内容，移除可能的markdown格式
        let cleanContent = content.trim();
        if (cleanContent.startsWith('```json')) {
            cleanContent = cleanContent.replace(/```json\s*/, '').replace(/```\s*$/, '');
        } else if (cleanContent.startsWith('```')) {
            cleanContent = cleanContent.replace(/```\s*/, '').replace(/```\s*$/, '');
        }
        
        const parsedData = JSON.parse(cleanContent);
        return {
            success: true,
            data: parsedData
        };
    } catch (parseError) {
        console.error('JSON解析错误:', parseError);
        console.error('原始内容:', content);
        throw new Error('AI返回的数据格式不正确，请重试');
    }
}

// 获取API Key（兼容GitHub Actions注入）
function getApiKey() {
    // GitHub Actions会通过sed替换将API Key注入到这里
    const config = {
        apiKey: 'DASHSCOPE_API_KEY_PLACEHOLDER'
    };
    
    // 检查API Key是否已被正确替换
    if (!config.apiKey || config.apiKey.length < 10 || !config.apiKey.startsWith('sk-')) {
        console.error('API Key未正确配置');
        return null;
    }
    
    return config.apiKey;
}

// 已弃用的Qwen API直接调用（保留作为参考）
async function callQwenAPI_deprecated(model, imageData) {
    const prompt = `请分析这张课表图片，提取出所有课程信息，并按照以下JSON格式返回：

{
  "courses": [
    {
      "name": "课程名称",
      "teacher": "教师姓名",
      "timeSlots": [
        {
          "location": "上课地点",
          "startWeek": 1,
          "endWeek": 16,
          "dayOfWeek": 1,
          "startClass": 1,
          "endClass": 2
        }
      ]
    }
  ]
}

注意：
1. dayOfWeek: 1=星期一, 2=星期二, ..., 7=星期日
2. startClass和endClass: 第几节课（从1开始）
3. 如果同一门课程在不同周次有不同安排，请为每个时间段创建单独的timeSlot
4. 请仔细识别所有课程信息，包括课程名称、教师、地点、时间等
5. 只返回JSON格式，不要包含其他文字`;

    // 使用兼容模式的API端点
    const apiUrl = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
    
    // 从GitHub Secrets获取API Key
    const apiKey = await getApiKey();
    if (!apiKey) {
        throw new Error('无法获取API Key，请检查GitHub Secrets配置');
    }
    
    let requestBody;
    
    if (model.startsWith('qwen-vl')) {
        // Qwen-VL模型支持图片
        requestBody = {
            model: model,
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'image_url',
                            image_url: {
                                url: imageData
                            }
                        },
                        {
                            type: 'text',
                            text: prompt
                        }
                    ]
                }
            ],
            max_tokens: 4000,
            temperature: 0.1
        };
    } else {
        // Qwen-Max等文本模型
        requestBody = {
            model: model,
            messages: [
                {
                    role: 'user',
                    content: prompt + '\n\n注意：由于当前模型不支持图片识别，请根据常见的课表格式进行推断。'
                }
            ],
            max_tokens: 4000,
            temperature: 0.1
        };
    }

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || errorData.message || `API请求失败: ${response.status}`);
    }
    
    const data = await response.json();
    const content = data.choices[0].message.content;
    
    try {
        // 尝试提取JSON
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('无法从响应中提取JSON数据');
        }
        
        const jsonData = JSON.parse(jsonMatch[0]);
        return { success: true, data: jsonData };
    } catch (parseError) {
        throw new Error('AI返回的数据格式不正确，请重试');
    }
}

// API Key现在通过服务端代理安全处理，前端不再需要直接访问

// 解析并填充数据
function parseAndFillData(data) {
    try {
        // 清空现有课程
        courses = [];
        
        // 填充课程信息
        if (data.courses && data.courses.length > 0) {
            data.courses.forEach(courseData => {
                const course = {
                    id: Date.now() + Math.random(),
                    name: courseData.name || '',
                    teacher: courseData.teacher || '',
                    timeSlots: []
                };
                
                if (courseData.timeSlots && courseData.timeSlots.length > 0) {
                    courseData.timeSlots.forEach(timeSlotData => {
                        // 验证和修正时间段数据
                        let startClass = parseInt(timeSlotData.startClass) || 1;
                        let endClass = parseInt(timeSlotData.endClass) || 2;
                        
                        // 确保classTimes数组足够长以容纳所有节次
                        const requiredLength = Math.max(startClass, endClass);
                        while (classTimes.length < requiredLength) {
                            // 扩展classTimes数组，添加默认时间段
                            const lastTime = classTimes[classTimes.length - 1];
                            let nextStartHour, nextStartMinute;
                            
                            if (lastTime) {
                                // 基于最后一个时间段计算下一个时间段
                                const [endHour, endMinute] = lastTime.end.split(':').map(Number);
                                if (endMinute + 10 >= 60) {
                                    nextStartHour = endHour + 1;
                                    nextStartMinute = (endMinute + 10) % 60;
                                } else {
                                    nextStartHour = endHour;
                                    nextStartMinute = endMinute + 10;
                                }
                            } else {
                                // 如果没有现有时间段，使用默认开始时间
                                nextStartHour = 8;
                                nextStartMinute = 30;
                            }
                            
                            // 计算结束时间（45分钟后）
                            let nextEndHour = nextStartHour;
                            let nextEndMinute = nextStartMinute + 45;
                            if (nextEndMinute >= 60) {
                                nextEndHour += Math.floor(nextEndMinute / 60);
                                nextEndMinute = nextEndMinute % 60;
                            }
                            
                            classTimes.push({
                                start: `${nextStartHour.toString().padStart(2, '0')}:${nextStartMinute.toString().padStart(2, '0')}`,
                                end: `${nextEndHour.toString().padStart(2, '0')}:${nextEndMinute.toString().padStart(2, '0')}`
                            });
                        }
                        
                        // 确保节次在有效范围内
                        if (startClass < 1) startClass = 1;
                        if (endClass < startClass) endClass = startClass;
                        
                        // 验证其他字段
                        let startWeek = parseInt(timeSlotData.startWeek) || 1;
                        let endWeek = parseInt(timeSlotData.endWeek) || 16;
                        let dayOfWeek = parseInt(timeSlotData.dayOfWeek) || 1;
                        
                        // 确保周数在合理范围内
                        if (startWeek < 1) startWeek = 1;
                        if (endWeek < startWeek) endWeek = startWeek;
                        if (endWeek > 30) endWeek = 30; // 限制最大周数
                        
                        // 确保星期在1-7范围内
                        if (dayOfWeek < 1) dayOfWeek = 1;
                        if (dayOfWeek > 7) dayOfWeek = 7;
                        
                        // 解析周次类型
                        let weekType = 'all'; // 默认每周
                        if (timeSlotData.weekType) {
                            const wt = timeSlotData.weekType.toLowerCase();
                            if (wt === 'odd' || wt === '单周' || wt === 'single') {
                                weekType = 'odd';
                            } else if (wt === 'even' || wt === '双周' || wt === 'double') {
                                weekType = 'even';
                            }
                        }
                        
                        course.timeSlots.push({
                            id: Date.now() + Math.random(),
                            location: timeSlotData.location || '',
                            startWeek: startWeek,
                            endWeek: endWeek,
                            dayOfWeek: dayOfWeek,
                            startClass: startClass,
                            endClass: endClass,
                            weekType: weekType
                        });
                    });
                } else {
                    // 如果没有时间段，创建一个默认的
                    course.timeSlots.push({
                        id: Date.now() + Math.random(),
                        location: '',
                        startWeek: 1,
                        endWeek: 16,
                        dayOfWeek: 1,
                        startClass: 1,
                        endClass: 2,
                        weekType: 'all'
                    });
                }
                
                courses.push(course);
            });
        }
        
        // 更新显示
        updateCoursesDisplay();
        
        // 更新课程时间显示（可能在AI解析过程中扩展了classTimes数组）
        updateClassTimesDisplay();
        
        // 滚动到课程信息区域
        document.getElementById('coursesList').scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        console.error('数据解析错误:', error);
        throw new Error('数据解析失败，请检查AI返回的数据格式');
    }
}

// 检测是否为Apple设备
function isAppleDevice() {
    const userAgent = navigator.userAgent;
    return /iPad|iPhone|iPod|Macintosh/.test(userAgent);
}

// 检测设备类型
function getDeviceType() {
    const userAgent = navigator.userAgent;
    if (/iPad/.test(userAgent)) return 'iPad';
    if (/iPhone/.test(userAgent)) return 'iPhone';
    if (/iPod/.test(userAgent)) return 'iPod';
    if (/Macintosh/.test(userAgent)) return 'Mac';
    return 'other';
}

// 检测是否为iPhone X以上机型（有刘海屏）
function isIPhoneWithNotch() {
    const userAgent = navigator.userAgent;
    const isIPhone = /iPhone/.test(userAgent);
    if (!isIPhone) return false;
    
    // 检测屏幕尺寸来判断是否为iPhone X以上机型
    const screenHeight = screen.height;
    const screenWidth = screen.width;
    
    // iPhone X系列的常见分辨率
    const notchPhoneResolutions = [
        { width: 375, height: 812 }, // iPhone X, XS, 11 Pro, 12 mini, 13 mini
        { width: 414, height: 896 }, // iPhone XR, XS Max, 11, 11 Pro Max
        { width: 390, height: 844 }, // iPhone 12, 12 Pro, 13, 13 Pro, 14
        { width: 428, height: 926 }, // iPhone 12 Pro Max, 13 Pro Max, 14 Plus, 14 Pro Max
        { width: 393, height: 852 }, // iPhone 14 Pro
        { width: 430, height: 932 }  // iPhone 14 Pro Max
    ];
    
    return notchPhoneResolutions.some(res => 
        (screenWidth === res.width && screenHeight === res.height) ||
        (screenWidth === res.height && screenHeight === res.width)
    );
}

// 优化移动端体验
function optimizeMobileExperience() {
    const deviceType = getDeviceType();
    
    // 为iPhone X以上机型添加特殊样式
    if (isIPhoneWithNotch()) {
        document.body.classList.add('iphone-notch');
        console.log('检测到iPhone X以上机型，已应用刘海屏适配');
    }
    
    // iPad特殊优化
    if (deviceType === 'iPad') {
        document.body.classList.add('ipad-device');
        console.log('检测到iPad设备，已应用平板优化');
    }
    
    // iPhone特殊优化
    if (deviceType === 'iPhone') {
        document.body.classList.add('iphone-device');
        console.log('检测到iPhone设备，已应用手机优化');
    }
    
    // 禁用iOS Safari的双击缩放
    if (isAppleDevice()) {
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function (event) {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
    }
    
    // 处理iOS输入框焦点问题
    if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
        let focusTimeout = null;
        let blurTimeout = null;
        let isInputSwitching = false;
        
        document.addEventListener('focusin', function(e) {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                // 清除之前的超时
                if (blurTimeout) {
                    clearTimeout(blurTimeout);
                    blurTimeout = null;
                    isInputSwitching = true;
                } else {
                    isInputSwitching = false;
                }
                
                // 延迟滚动到输入框，确保键盘已弹出
                focusTimeout = setTimeout(() => {
                    if (e.target === document.activeElement) {
                        // 只有在输入框不在可视区域时才滚动
                        const rect = e.target.getBoundingClientRect();
                        const windowHeight = window.innerHeight;
                        const keyboardHeight = windowHeight * 0.35; // 估算键盘高度
                        
                        // 检查输入框是否被键盘遮挡或在屏幕外
                        if (rect.top < 100 || rect.bottom > windowHeight - keyboardHeight) {
                            e.target.scrollIntoView({ 
                                behavior: isInputSwitching ? 'smooth' : 'auto',
                                block: 'center',
                                inline: 'nearest'
                            });
                        }
                    }
                }, isInputSwitching ? 100 : 300);
            }
        });
        
        document.addEventListener('focusout', function(e) {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                // 清除焦点超时
                if (focusTimeout) {
                    clearTimeout(focusTimeout);
                    focusTimeout = null;
                }
                
                // 延迟处理失焦，检测是否是输入框切换
                blurTimeout = setTimeout(() => {
                    const activeElement = document.activeElement;
                    const isAnotherInputFocused = activeElement && 
                        (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA');
                    
                    if (!isAnotherInputFocused) {
                        // 真正失焦，键盘将隐藏
                        isInputSwitching = false;
                        // 不执行任何滚动操作，让页面保持当前位置
                    }
                }, 100);
            }
        });
    }
}

// 一键导入到Apple日历
function importToAppleCalendar() {
    if (!window.currentICSContent) {
        showErrorMessage('请先生成ICS文件！');
        return;
    }
    
    try {
        // 创建Blob对象
        const blob = new Blob([window.currentICSContent], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        
        // 创建隐藏的下载链接，使用webcal协议
        const link = document.createElement('a');
        const webcalUrl = url.replace('blob:', 'webcal://');
        
        // 对于Apple设备，尝试使用不同的方式
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
            // iOS设备：尝试直接打开日历应用
            const calendarUrl = `data:text/calendar;charset=utf8,${encodeURIComponent(window.currentICSContent)}`;
            window.open(calendarUrl, '_blank');
            
            showSuccessMessage('正在打开日历应用，请确认导入课程表。');
        } else if (/Macintosh/.test(navigator.userAgent)) {
            // macOS设备：下载文件并提示用户
            link.href = url;
            link.download = '课程表.ics';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            showSuccessMessage('ICS文件已下载，请双击文件导入到日历应用。');
        } else {
            // 其他设备：普通下载
            link.href = url;
            link.download = '课程表.ics';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            showSuccessMessage('ICS文件已下载，请导入到您的日历应用。');
        }
        
        // 清理URL对象
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        
    } catch (error) {
        console.error('导入失败:', error);
        showErrorMessage('导入失败，请手动下载ICS文件。');
    }
}

// 设置大学搜索功能
function setupUniversitySearch() {
    const searchInput = document.getElementById('universitySearch');
    const dropdown = document.getElementById('universityDropdown');
    const selectedDiv = document.getElementById('selectedUniversity');
    const selectedNameSpan = document.getElementById('selectedUniversityName');
    const clearButton = document.getElementById('clearUniversity');
    const hiddenInput = document.getElementById('schoolAddress');
    
    let selectedUniversity = null;
    let keyboardSelectedIndex = -1; // 键盘选中的索引
    let currentMatches = []; // 当前搜索匹配的结果
    let dropdownItems = []; // 当前下拉框中的所有项目
    
    // 获取所有大学名称
    const universities = Object.keys(window.universitiesData || {});
    
    // 输入事件处理
    searchInput.addEventListener('input', function() {
        const query = this.value.trim().toLowerCase();
        
        // 重置键盘选择
        keyboardSelectedIndex = -1;
        
        if (query.length === 0) {
            hideDropdown();
            return;
        }
        
        // 模糊搜索
        const matches = universities.filter(name => 
            name.toLowerCase().includes(query) ||
            name.replace(/大学|学院|科技|理工|师范/g, '').toLowerCase().includes(query)
        ).slice(0, 10); // 限制显示10个结果
        
        // 保存当前匹配结果
        currentMatches = matches;
        
        // 无论是否有匹配结果都显示下拉框（包含"其他学校"选项）
        showDropdown(matches, query);
    });
    
    // 焦点事件
    searchInput.addEventListener('focus', function() {
        if (this.value.trim().length > 0) {
            const query = this.value.trim().toLowerCase();
            const matches = universities.filter(name => 
                name.toLowerCase().includes(query)
            ).slice(0, 10);
            
            // 保存当前匹配结果
            currentMatches = matches;
            
            // 无论是否有匹配结果都显示下拉框（包含"其他学校"选项）
            showDropdown(matches, query);
        }
    });
    
    // 键盘导航事件
    searchInput.addEventListener('keydown', function(e) {
        if (!dropdown.classList.contains('hidden')) {
            switch(e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    moveSelection(1);
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    moveSelection(-1);
                    break;
                case 'Enter':
                    e.preventDefault();
                    selectCurrentItem();
                    break;
                case 'Escape':
                    e.preventDefault();
                    hideDropdown();
                    keyboardSelectedIndex = -1;
                    break;
            }
        }
    });
    
    // 点击外部关闭下拉框
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
            hideDropdown();
        }
    });
    
    // 清除选择
    clearButton.addEventListener('click', function() {
        clearSelection();
    });
    
    // 显示下拉框
    function showDropdown(matches, query) {
        dropdown.innerHTML = '';
        dropdownItems = []; // 重置下拉框项目数组
        
        // 显示匹配的学校
        matches.forEach((name, index) => {
            const item = document.createElement('div');
            item.className = 'px-3 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100';
            item.setAttribute('data-type', 'university');
            item.setAttribute('data-name', name);
            
            // 高亮匹配的文字
            const highlightedName = highlightMatch(name, query);
            item.innerHTML = `
                <div class="font-medium text-gray-900">${highlightedName}</div>
                <div class="text-sm text-gray-500">${window.universitiesData[name].address}</div>
            `;
            
            item.addEventListener('click', function() {
                selectUniversity(name);
            });
            
            dropdown.appendChild(item);
            dropdownItems.push(item); // 添加到项目数组
        });
        
        // 如果没有匹配结果，显示提示信息
        if (matches.length === 0) {
            const noResultItem = document.createElement('div');
            noResultItem.className = 'px-3 py-2 text-gray-500 text-center border-b border-gray-100';
            noResultItem.setAttribute('data-type', 'no-result');
            noResultItem.innerHTML = `
                <div class="text-sm">未找到匹配的学校</div>
            `;
            dropdown.appendChild(noResultItem);
            // 不添加到dropdownItems，因为这不是可选择的项目
        }
        
        // 添加分隔线（如果有匹配结果）
        if (matches.length > 0) {
            const separator = document.createElement('div');
            separator.className = 'border-t border-gray-200';
            dropdown.appendChild(separator);
        }
        
        // 始终添加"其他学校"选项
        const otherItem = document.createElement('div');
        otherItem.className = 'px-3 py-2 hover:bg-gray-50 cursor-pointer bg-gray-50';
        otherItem.setAttribute('data-type', 'other');
        otherItem.innerHTML = `
            <div class="font-medium text-gray-700">📝 其他学校</div>
            <div class="text-sm text-gray-500">手动输入学校信息</div>
        `;
        
        otherItem.addEventListener('click', function() {
            selectOtherSchool();
        });
        
        dropdown.appendChild(otherItem);
        dropdownItems.push(otherItem); // 添加到项目数组
        
        dropdown.classList.remove('hidden');
        
        // 重置键盘选择索引
        keyboardSelectedIndex = -1;
    }
    
    // 隐藏下拉框
    function hideDropdown() {
        dropdown.classList.add('hidden');
        keyboardSelectedIndex = -1;
        // 清除所有键盘选中状态
        dropdownItems.forEach(item => {
            item.classList.remove('keyboard-selected');
        });
    }
    
    // 移动选择
    function moveSelection(direction) {
        if (dropdownItems.length === 0) return;
        
        // 清除当前选中状态
        if (keyboardSelectedIndex >= 0 && keyboardSelectedIndex < dropdownItems.length) {
            dropdownItems[keyboardSelectedIndex].classList.remove('keyboard-selected');
        }
        
        // 计算新的选中索引
        keyboardSelectedIndex += direction;
        
        // 边界处理：循环选择
        if (keyboardSelectedIndex >= dropdownItems.length) {
            keyboardSelectedIndex = 0;
        } else if (keyboardSelectedIndex < 0) {
            keyboardSelectedIndex = dropdownItems.length - 1;
        }
        
        // 应用新的选中状态
        if (keyboardSelectedIndex >= 0 && keyboardSelectedIndex < dropdownItems.length) {
            dropdownItems[keyboardSelectedIndex].classList.add('keyboard-selected');
            
            // 滚动到可视区域
            dropdownItems[keyboardSelectedIndex].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }
    }
    
    // 选择当前项目
    function selectCurrentItem() {
        if (keyboardSelectedIndex >= 0 && keyboardSelectedIndex < dropdownItems.length) {
            const selectedItem = dropdownItems[keyboardSelectedIndex];
            const itemType = selectedItem.getAttribute('data-type');
            
            if (itemType === 'university') {
                const universityName = selectedItem.getAttribute('data-name');
                selectUniversity(universityName);
            } else if (itemType === 'other') {
                selectOtherSchool();
            }
        }
    }
    
    // 高亮匹配文字
    function highlightMatch(text, query) {
        if (!query) return text;
        
        const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
        return text.replace(regex, '<span class="bg-yellow-200">$1</span>');
    }
    
    // 转义正则表达式特殊字符
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    // 选择大学
    function selectUniversity(name) {
        selectedUniversity = name;
        const universityData = window.universitiesData[name];
        
        // 更新UI
        searchInput.value = name;
        selectedNameSpan.textContent = name;
        selectedDiv.classList.remove('hidden');
        hideDropdown();
        
        // 更新学校地址字段
        const addressInput = document.getElementById('schoolAddress');
        addressInput.value = universityData.address;
        
        // 禁用手动输入（因为已自动填充）
        addressInput.disabled = true;
        addressInput.style.backgroundColor = '#f3f4f6';
        addressInput.title = '已自动填充，如需修改请先清除学校选择';
        
        // 自动填充相关信息
        autoFillUniversityData(universityData);
        
        showSuccessMessage(`已选择 ${name}，相关信息已自动填充！`);
    }
    
    // 选择其他学校
    function selectOtherSchool() {
        selectedUniversity = null;
        
        // 更新UI
        searchInput.value = '其他学校';
        selectedNameSpan.textContent = '其他学校（手动输入）';
        selectedDiv.classList.remove('hidden');
        hideDropdown();
        
        // 清除自动填充的数据，恢复默认值
        document.getElementById('classesPerDay').value = '11';
        document.getElementById('classDuration').value = '45';
        document.getElementById('breakDuration').value = '15';
        
        // 重新初始化默认课程时间
        classTimes = [...defaultClassTimes];
        updateClassTimesDisplay();
        
        // 启用手动输入的地址框并聚焦
        const addressInput = document.getElementById('schoolAddress');
        addressInput.disabled = false;
        addressInput.style.backgroundColor = '';
        addressInput.title = '';
        addressInput.value = '';
        addressInput.focus();
        addressInput.placeholder = '请输入完整的学校地址，如：某某大学某某校区';
        
        showSuccessMessage('请手动输入学校地址和配置课程时间！');
    }
    
    // 清除选择
    function clearSelection() {
        selectedUniversity = null;
        searchInput.value = '';
        selectedDiv.classList.add('hidden');
        
        // 恢复地址输入框状态
        const addressInput = document.getElementById('schoolAddress');
        addressInput.value = '';
        addressInput.disabled = false;
        addressInput.style.backgroundColor = '';
        addressInput.title = '';
        addressInput.placeholder = '例如：北京大学燕园校区';
        
        // 清除自动填充的数据，恢复默认值
        document.getElementById('classesPerDay').value = 11;
        document.getElementById('classDuration').value = '45';
        document.getElementById('breakDuration').value = '15';
        
        // 重新初始化默认课程时间
        classTimes = [...defaultClassTimes];
        updateClassTimesDisplay();
        
        showSuccessMessage('已清除学校选择，请重新选择或手动输入信息。');
    }
    
    // 自动填充大学数据
    function autoFillUniversityData(universityData) {
        // 填充课程数量（如果为null则使用默认值11）
        const classesPerDay = universityData.classesPerDay || 11;
        document.getElementById('classesPerDay').value = classesPerDay;
        
        // 填充每节课时长（如果有的话，否则默认45分钟）
        const classDuration = universityData.classDuration || 45;
        document.getElementById('classDuration').value = classDuration;
        
        // 填充大节间休息时间（如果有的话，否则默认15分钟）
        const breakDuration = universityData.breakDuration || 15;
        document.getElementById('breakDuration').value = breakDuration;
        
        // 清除并重新填充课程时间
        clearClassTimes();
        
        // 更新课程时间
        classTimes.length = 0;
        
        // 如果有具体的课程时间数据，使用它们；否则使用默认时间
        if (universityData.classTimes && universityData.classTimes.length > 0) {
            universityData.classTimes.forEach(time => {
                classTimes.push({
                    start: time.start,
                    end: time.end
                });
            });
        } else {
            // 使用默认课程时间
            classTimes.push(...defaultClassTimes);
        }
        
        // 更新显示
        updateClassTimesDisplay();
    }
    
    // 清除课程时间
    function clearClassTimes() {
        const container = document.getElementById('classTimes');
        container.innerHTML = '';
        classTimes.length = 0;
    }
    
}

// 更新课程时间
function updateClassTime(index, field, value) {
    if (classTimes[index]) {
        classTimes[index][field] = value;
        // 如果是开始时间变化，自动更新结束时间
        if (field === 'start') {
            updateEndTime(index);
        }
    }
}

// 移除课程时间
function removeClassTime(index) {
    classTimes.splice(index, 1);
    updateClassTimesDisplay();
    
    // 更新课程数量
    document.getElementById('classesPerDay').value = classTimes.length;
}
