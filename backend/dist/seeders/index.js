"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedData = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const seedData = () => __awaiter(void 0, void 0, void 0, function* () {
    const Models = require('../models').default;
    const jwtSecret = require('../config').jwtSecret;
    try {
        const existingUsers = yield Models.Users.count();
        if (existingUsers > 0) {
            console.log('Database already seeded, skipping...');
            return;
        }
        console.log('Seeding database...');
        const hashedPassword = yield bcrypt_1.default.hash('admin123', 12);
        const adminUser = yield Models.Users.create({
            name: 'Admin',
            email: 'admin@hiring.com',
            password: hashedPassword,
            role: 'admin'
        });
        const recruiterPassword = yield bcrypt_1.default.hash('recruiter123', 12);
        const recruiterUser = yield Models.Users.create({
            name: 'John Recruiter',
            email: 'recruiter@techcorp.com',
            password: recruiterPassword,
            role: 'recruiter'
        });
        const recruiter2User = yield Models.Users.create({
            name: 'Sarah HR',
            email: 'sarah@innovate.io',
            password: recruiterPassword,
            role: 'recruiter'
        });
        const recruiter3User = yield Models.Users.create({
            name: 'Mike Talent',
            email: 'mike@startup.com',
            password: recruiterPassword,
            role: 'recruiter'
        });
        yield Models.Recruiters.bulkCreate([
            {
                userId: recruiterUser.id,
                company: 'TechCorp Solutions',
                industryFocus: 'Technology',
                requiredSkills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'SQL'],
                minimumExperience: 3,
                location: 'New York'
            },
            {
                userId: recruiter2User.id,
                company: 'Innovate IO',
                industryFocus: 'Software',
                requiredSkills: ['Python', 'Django', 'AWS', 'Docker', 'Kubernetes'],
                minimumExperience: 5,
                location: 'San Francisco'
            },
            {
                userId: recruiter3User.id,
                company: 'StartupHub',
                industryFocus: 'Technology',
                requiredSkills: ['JavaScript', 'React', 'Vue.js', 'MongoDB', 'GraphQL'],
                minimumExperience: 2,
                location: 'Austin'
            }
        ]);
        const candidatePassword = yield bcrypt_1.default.hash('candidate123', 12);
        const candidateUser = yield Models.Users.create({
            name: 'Jane Candidate',
            email: 'jane@email.com',
            password: candidatePassword,
            role: 'user'
        });
        yield Models.Candidates.create({
            userId: candidateUser.id,
            name: 'Jane Candidate',
            email: 'jane@email.com',
            phone: '+1234567890',
            skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'SQL'],
            experience: 4
        });
        yield Models.JobPositions.bulkCreate([
            {
                title: 'Senior Frontend Developer',
                description: 'Build modern web applications using React and TypeScript',
                requirements: '5+ years experience with React, TypeScript, and modern CSS',
                department: 'Engineering',
                location: 'New York',
                salaryRange: '$120,000 - $150,000',
                status: 'open'
            },
            {
                title: 'Backend Engineer',
                description: 'Design and implement scalable APIs',
                requirements: '3+ years with Node.js, Python, and cloud services',
                department: 'Engineering',
                location: 'San Francisco',
                salaryRange: '$130,000 - $160,000',
                status: 'open'
            },
            {
                title: 'Full Stack Developer',
                description: 'Work on end-to-end features for our platform',
                requirements: '2+ years with JavaScript, React, and Node.js',
                department: 'Engineering',
                location: 'Austin',
                salaryRange: '$90,000 - $120,000',
                status: 'open'
            }
        ]);
        console.log('Database seeded successfully!');
    }
    catch (error) {
        console.error('Seeding error:', error);
    }
});
exports.seedData = seedData;
