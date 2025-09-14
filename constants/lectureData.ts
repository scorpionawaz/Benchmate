export interface Lecture {
  id: string;
  name: string;
  subject: string;
  time: string;
  duration: string;
  day: string;
}

export const TIMETABLE: Lecture[] = [
  {
    id: 'CS101_MON_09',
    name: 'Data Structures',
    subject: 'Computer Science',
    time: '09:00 AM',
    duration: '60 mins',
    day: 'Monday'
  },
  {
    id: 'CS102_MON_11',
    name: 'Algorithms',
    subject: 'Computer Science', 
    time: '11:00 AM',
    duration: '60 mins',
    day: 'Monday'
  },
  {
    id: 'CS103_TUE_09',
    name: 'Database Systems',
    subject: 'Computer Science',
    time: '09:00 AM', 
    duration: '60 mins',
    day: 'Tuesday'
  },
  {
    id: 'CS104_WED_10',
    name: 'Web Development',
    subject: 'Computer Science',
    time: '10:00 AM',
    duration: '60 mins', 
    day: 'Wednesday'
  },
  {
    id: 'CS105_THU_14',
    name: 'Mobile App Development',
    subject: 'Computer Science',
    time: '02:00 PM',
    duration: '90 mins',
    day: 'Thursday'
  }
];

export const getCurrentLecture = (): Lecture | null => {
  const now = new Date();
  const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
  const currentTime = now.getHours() * 100 + now.getMinutes();
  
  const todayLectures = TIMETABLE.filter(lecture => lecture.day === currentDay);
  
  for (const lecture of todayLectures) {
    const [time, period] = lecture.time.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    let lectureTime = hours * 100 + minutes;
    
    if (period === 'PM' && hours !== 12) {
      lectureTime += 1200;
    } else if (period === 'AM' && hours === 12) {
      lectureTime -= 1200;
    }
    
    const durationMinutes = parseInt(lecture.duration);
    const endTime = lectureTime + Math.floor(durationMinutes / 60) * 100 + (durationMinutes % 60);
    
    if (currentTime >= lectureTime && currentTime <= endTime) {
      return lecture;
    }
  }
  
  return null;
};
