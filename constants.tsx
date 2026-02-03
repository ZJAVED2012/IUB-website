import React from 'react';
import { BookOpen, Users, GraduationCap, Building2 } from 'lucide-react';
import { NewsItem, Department, StatItem } from './types';

export const COLORS = {
  primary: '#004d2c', // Official IUB Green
  secondary: '#ffcc00', // Accent Gold
  dark: '#00331d',
};

export const NAVIGATION = [
  { name: 'Home', href: '#/' },
  { name: 'Admissions', href: '#/admissions' },
  { name: 'Academics', href: '#/academics' },
  { name: 'Research', href: '#/research' },
  { name: 'Faculty', href: '#/faculty' },
  { name: 'Portal', href: '#/portal' },
];

export const STATS: StatItem[] = [
  { label: 'Total Students', value: '45,000+', icon: 'Users' },
  { label: 'Faculty Members', value: '1,200+', icon: 'GraduationCap' },
  { label: 'Research Papers', value: '15,000+', icon: 'BookOpen' },
  { label: 'Departments', value: '120+', icon: 'Building2' },
];

export const NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'Admissions Open for Fall 2024 Semester',
    date: 'Oct 15, 2023',
    category: 'Notice',
    excerpt: 'Online applications are invited for various Undergraduate and Graduate programs...',
  },
  {
    id: '2',
    title: 'IUB Research Symposium 2023',
    date: 'Nov 02, 2023',
    category: 'Event',
    excerpt: 'Join us for the annual gathering of scientists and scholars at the main campus...',
  },
  {
    id: '3',
    title: 'Annual Sports Gala Kickstarts Tomorrow',
    date: 'Oct 20, 2023',
    category: 'General',
    excerpt: 'The much awaited sports festival will feature over 20 different sporting events...',
  },
];

export const DEPARTMENTS: Department[] = [
  { 
    id: '1', 
    name: 'Computer Science', 
    faculty: 'Faculty of Computing', 
    image: 'https://picsum.photos/id/1/800/600',
    description: 'The Department of Computer Science at IUB is a hub of innovation and technical excellence. Established to meet the growing demand for skilled professionals in the IT sector, we provide cutting-edge education in artificial intelligence, software engineering, and data science.',
    headOfDepartment: 'Dr. Muhammad Shahid',
    researchAreas: ['Artificial Intelligence', 'Cyber Security', 'Cloud Computing', 'Data Analytics'],
    programsOffered: [
      { name: 'BS Computer Science', duration: '4 Years', description: 'A comprehensive study of computing fundamentals, algorithms, and software development.' },
      { name: 'BS Software Engineering', duration: '4 Years', description: 'Focuses on the systematic approach to the development, operation, and maintenance of software.' },
      { name: 'MS Computer Science', duration: '2 Years', description: 'Advanced research-oriented program covering Al, Machine Learning, and Big Data.' },
      { name: 'PhD Computer Science', duration: '3-5 Years', description: 'Terminal degree focused on original research and contributing to the global body of knowledge.' }
    ],
    contactEmail: 'cs@iub.edu.pk',
    contactPhone: '+92 62 9250235 Ext. 101',
    facultyMembers: [
      { 
        name: 'Dr. Ahmad Raza', 
        designation: 'Professor', 
        qualification: 'PhD Computer Science (USA)', 
        image: 'https://i.pravatar.cc/150?u=1',
        bio: 'Dr. Ahmad Raza is a pioneer in the field of Distributed Systems and Cloud Computing in Pakistan. With over 20 years of experience in both academia and industry, he has spearheaded numerous national-level IT projects.',
        linkedin: 'https://linkedin.com/in/ahmad-raza-iub',
        website: 'https://ahmadraza.faculty.iub.edu.pk',
        researchInterests: ['Cloud Orchestration', 'Distributed Algorithms', 'Big Data Systems'],
        publications: [
          {
            title: 'Dynamic Resource Allocation in Edge Computing',
            year: '2022',
            journal: 'IEEE Transactions on Cloud Computing',
            link: '#'
          },
          {
            title: 'Scalability Challenges in Modern Microservices',
            year: '2020',
            journal: 'Journal of Systems and Software',
            link: '#'
          },
          {
            title: 'High Performance Computing in South Asia',
            year: '2018',
            journal: 'ACM Computing Surveys'
          }
        ],
        researchPapers: [
          'Optimizing Query Processing in Large Scale Distributed Graphs (Working Paper, 2023)',
          'A Survey of Energy Efficient Resource Allocation in Cloud Environments (Pre-print, 2022)'
        ],
        conferences: [
          'IEEE International Conference on Cloud Computing, San Francisco (2021)',
          'Keynote: Future of Distributed Systems at South Asia Tech Summit (2022)',
          'ACM Symposium on Principles of Distributed Computing (2019)'
        ]
      },
      { 
        name: 'Dr. Sara Khan', 
        designation: 'Associate Professor', 
        qualification: 'PhD AI (UK)', 
        image: 'https://i.pravatar.cc/150?u=2',
        bio: 'Dr. Sara Khan specializes in Natural Language Processing and Machine Learning. Her research focuses on low-resource language processing, particularly Urdu and regional dialects of Pakistan.',
        linkedin: 'https://linkedin.com/in/sara-khan-nlp',
        website: 'https://sarakhan.faculty.iub.edu.pk',
        researchInterests: ['Urdu NLP', 'Deep Learning', 'Computer Vision'],
        publications: [
          {
            title: 'Transformer Models for Urdu Sentiment Analysis',
            year: '2023',
            journal: 'Language Resources and Evaluation',
            link: '#'
          },
          {
            title: 'Multi-modal Learning in Healthcare',
            year: '2021',
            journal: 'Artificial Intelligence in Medicine'
          }
        ],
        researchPapers: [
          'Attention Mechanisms for Dialect Recognition in Northern Pakistan (2023)',
          'Zero-shot Learning for low-resource South Asian Languages (2022)'
        ],
        conferences: [
          'NLP Conference on Low Resource Languages, London (2022)',
          'Global AI Ethics Workshop, Dubai (2023)'
        ]
      }
    ]
  },
  { 
    id: '2', 
    name: 'Medical Sciences', 
    faculty: 'Faculty of Medicine', 
    image: 'https://picsum.photos/id/2/800/600',
    description: 'Our Faculty of Medicine is dedicated to producing world-class healthcare professionals. With state-of-the-art laboratories and affiliation with major hospitals, we ensure our students receive both theoretical knowledge and practical clinical experience.',
    headOfDepartment: 'Dr. Fatima Zahra',
    researchAreas: ['Molecular Medicine', 'Public Health', 'Pharmacology', 'Anatomy'],
    programsOffered: [
      { name: 'MBBS', duration: '5 Years', description: 'Bachelor of Medicine and Bachelor of Surgery, the foundational medical degree.' },
      { name: 'BDS', duration: '4 Years', description: 'Bachelor of Dental Surgery, focusing on oral healthcare and dental sciences.' },
      { name: 'MS Clinical Medicine', duration: '2 Years', description: 'Advanced clinical training for medical professionals in specialized fields.' }
    ],
    contactEmail: 'medical@iub.edu.pk',
    contactPhone: '+92 62 9250231 Ext. 202',
    facultyMembers: [
      { 
        name: 'Dr. Bilal Qureshi', 
        designation: 'Professor', 
        qualification: 'MD, PhD', 
        image: 'https://i.pravatar.cc/150?u=4',
        bio: 'Dr. Bilal is a renowned researcher in Cardiology with a focus on preventative medicine. He has served as a consultant for the World Health Organization on regional health policies.',
        linkedin: 'https://linkedin.com/in/bilal-qureshi-md',
        website: 'https://bilalqureshi.faculty.iub.edu.pk',
        researchInterests: ['Cardiovascular Health', 'Preventative Medicine', 'Global Health'],
        publications: [
          {
            title: 'Modern Trends in Heart Disease Prevention',
            year: '2023',
            journal: 'The Lancet Public Health'
          },
          {
            title: 'Community Health in Rural Punjab',
            year: '2021',
            journal: 'International Journal of Health Policy'
          }
        ],
        researchPapers: [
          'Impact of Urbanization on Cardiovascular Health in Bahawalpur Region (2023)'
        ],
        conferences: [
          'International Heart Health Expo, Geneva (2022)',
          'WHO Public Health Policy Seminar (2021)'
        ]
      }
    ]
  },
  { 
    id: '3', 
    name: 'Management Sciences', 
    faculty: 'Faculty of Management', 
    image: 'https://picsum.photos/id/3/800/600',
    description: 'The Faculty of Management Sciences focuses on developing leadership qualities and entrepreneurial skills. Our curriculum is designed to meet global business standards, integrating case studies and industry collaborations.',
    headOfDepartment: 'Prof. Dr. Jawad Ahmed',
    researchAreas: ['Financial Management', 'Strategic Marketing', 'HRM', 'Supply Chain'],
    programsOffered: [
      { name: 'BBA Honors', duration: '4 Years', description: 'Prepares students for leadership roles in business and management.' },
      { name: 'MBA', duration: '2 Years', description: 'Advanced business degree for aspiring managers and entrepreneurs.' },
      { name: 'MS Management Sciences', duration: '2 Years', description: 'Focuses on research and advanced theories in business management.' }
    ],
    contactEmail: 'management@iub.edu.pk',
    contactPhone: '+92 62 9250238 Ext. 303',
    facultyMembers: [
      { 
        name: 'Dr. Khalid Mehmood', 
        designation: 'Professor', 
        qualification: 'PhD Finance', 
        image: 'https://i.pravatar.cc/150?u=6',
        bio: 'Expert in Islamic Finance and Emerging Market Economics. Dr. Khalid has advised several national banks on financial restructuring.',
        linkedin: 'https://linkedin.com/in/khalid-mehmood-finance',
        website: 'https://khalidmehmood.faculty.iub.edu.pk',
        researchInterests: ['Islamic Banking', 'Portfolio Management', 'Corporate Governance'],
        publications: [
          {
            title: 'Ethical Investing in Pakistan',
            year: '2022',
            journal: 'Journal of Islamic Accounting and Business Research'
          }
        ],
        researchPapers: [
          'Blockchain in Islamic Finance: Opportunities and Risks (2023)'
        ],
        conferences: [
          'Islamic Finance Global Forum, Kuala Lumpur (2023)',
          'Sustainable Economics Workshop (2022)'
        ]
      }
    ]
  },
  { 
    id: '4', 
    name: 'Social Sciences', 
    faculty: 'Faculty of Arts', 
    image: 'https://picsum.photos/id/4/800/600',
    description: 'The Faculty of Social Sciences encourages critical thinking and a deep understanding of human society. From Psychology to Sociology, we offer a diverse range of programs that prepare students for impactful careers in public and private sectors.',
    headOfDepartment: 'Dr. Zainab Bibi',
    researchAreas: ['Social Policy', 'Development Studies', 'Clinical Psychology', 'International Relations'],
    programsOffered: [
      { name: 'BS Psychology', duration: '4 Years', description: 'Scientific study of the human mind and its functions.' },
      { name: 'BS Sociology', duration: '4 Years', description: 'Exploration of social behavior, society, and patterns of social relationships.' },
      { name: 'BS Political Science', duration: '4 Years', description: 'Study of systems of government and the analysis of political activities.' }
    ],
    contactEmail: 'socialsciences@iub.edu.pk',
    contactPhone: '+92 62 9250234 Ext. 404',
    facultyMembers: [
      { 
        name: 'Dr. Hassan Javid', 
        designation: 'Professor', 
        qualification: 'PhD Sociology', 
        image: 'https://i.pravatar.cc/150?u=8',
        bio: 'Social historian and sociologist focusing on agrarian change and social movements in South Asia.',
        linkedin: 'https://linkedin.com/in/hassan-javid-iub',
        website: 'https://hassanjavid.faculty.iub.edu.pk',
        researchInterests: ['Political Sociology', 'Rural Development', 'History of Punjab'],
        publications: [
          {
            title: 'The Agrarian Question in Pakistan',
            year: '2019',
            journal: 'Journal of Peasant Studies'
          }
        ],
        researchPapers: [
          'Social Mobilization and Local Governance in Southern Punjab (Working Paper)'
        ],
        conferences: [
          'South Asian Sociology Summit (2020)',
          'Development Studies Workshop, Islamabad (2021)'
        ]
      }
    ]
  },
];