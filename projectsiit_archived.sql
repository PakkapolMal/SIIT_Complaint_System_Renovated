-- This SQL dump was no longer used after the decision to switch to Supabase.

-- phpMyAdmin SQL Dump
-- version 5.1.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 11, 2025 at 08:40 AM
-- Server version: 5.7.24
-- PHP Version: 8.3.1

--
-- MODIFIED to change StudentID from INT(11) to BIGINT
-- to support larger ID numbers.
--

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `projectsiit`
--
CREATE DATABASE IF NOT EXISTS `projectsiit`;
USE `projectsiit`;

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `AdminID` int(11) NOT NULL,
  `Role` varchar(50) DEFAULT NULL,
  `Password` varchar(255) DEFAULT NULL,
  `StaffID` int(11) DEFAULT NULL,
  `StudentID` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`AdminID`, `Role`, `Password`, `StaffID`, `StudentID`) VALUES
(101, 'Admin', '$2y$10$kirF9/KUhclNtc2T3T1PreRhwxEUQnL1eTakX7XrlyAJUbKpCxN3W', 101, NULL),
(102, 'Admin', '$2y$10$kirF9/KUhclNtc2T3T1PreRhwxEUQnL1eTakX7XrlyAJUbKpCxN3W', 102, NULL),
(103, 'Admin', '$2y$10$kirF9/KUhclNtc2T3T1PreRhwxEUQnL1eTakX7XrlyAJUbKpCxN3W', 103, NULL),
(104, 'Admin', '$2y$10$kirF9/KUhclNtc2T3T1PreRhwxEUQnL1eTakX7XrlyAJUbKpCxN3W', 104, NULL),
(105, 'Admin', '$2y$10$kirF9/KUhclNtc2T3T1PreRhwxEUQnL1eTakX7XrlyAJUbKpCxN3W', 105, NULL),
(106, 'Admin', '$2y$10$kirF9/KUhclNtc2T3T1PreRhwxEUQnL1eTakX7XrlyAJUbKpCxN3W', 106, NULL),
(107, 'Admin', '$2y$10$kirF9/KUhclNtc2T3T1PreRhwxEUQnL1eTakX7XrlyAJUbKpCxN3W', 107, NULL),
(108, 'Admin', '$2y$10$kirF9/KUhclNtc2T3T1PreRhwxEUQnL1eTakX7XrlyAJUbKpCxN3W', 108, NULL),
(109, 'Admin', '$2y$10$kirF9/KUhclNtc2T3T1PreRhwxEUQnL1eTakX7XrlyAJUbKpCxN3W', 109, NULL),
(110, 'Admin', '$2y$10$kirF9/KUhclNtc2T3T1PreRhwxEUQnL1eTakX7XrlyAJUbKpCxN3W', 110, NULL),
(1000, 'SuperAdmin', '$2y$10$LezBVDJU0Uqrt9FvL0AO0u6XHryW4Kwe1NDbKCOsH8cXH4TBDvxLC', NULL, 1000),
(1001, 'SuperAdmin', '$2y$10$LezBVDJU0Uqrt9FvL0AO0u6XHryW4Kwe1NDbKCOsH8cXH4TBDvxLC', NULL, 1001),
(1002, 'SuperAdmin', '$2y$10$LezBVDJU0Uqrt9FvL0AO0u6XHryW4Kwe1NDbKCOsH8cXH4TBDvxLC', NULL, 1002),
(1003, 'SuperAdmin', '$2y$10$LezBVDJU0Uqrt9FvL0AO0u6XHryW4Kwe1NDbKCOsH8cXH4TBDvxLC', NULL, 1003),
(1004, 'SuperAdmin', '$2y$10$LezBVDJU0Uqrt9FvL0AO0u6XHryW4Kwe1NDbKCOsH8cXH4TBDvxLC', NULL, 1004),
(1010, 'SuperAdmin', '$2y$10$LezBVDJU0Uqrt9FvL0AO0u6XHryW4Kwe1NDbKCOsH8cXH4TBDvxLC', NULL, 1010);

-- --------------------------------------------------------

--
-- Table structure for table `question`
--

CREATE TABLE `question` (
  `QID` int(11) NOT NULL,
  `QText` text,
  `TopicID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `question`
--

INSERT INTO `question` (`QID`, `QText`, `TopicID`) VALUES
(101, 'Issues CHECKBOX:Teaching method is not conducive to learning|Examination Misconduct|Unfair, Unclear Grading, Lack of Grade Transparency|Excessive Workload|Lack/Unclear Communication|Difficulty accessing learning material', 1),
(102, 'Course Code, Section, Respective Professor (for accuracy to follow up)', 1),
(103, 'State an approximate time frame and how often do you face this issue?', 1),
(104, 'Describe the details of the issue', 1),
(105, 'Describe the effects that this issue has created', 1),
(106, 'Would you like to require any additional help or specific actions regarding the issue(s)?', 1),
(107, 'Attach additional evidence (If any) FILE:', 1),
(201, 'Issues CHECKBOX:SOTUS practices or Abuse of Power|Physical and/or Mental Threats/Assault|Bullying|Sexual Harassment|Discrimination against ones sex/ethnicity/religion|Sharing of Confidential Information without Consent (PDPA)|Unfair Treatment', 2),
(202, 'Describe problem details', 2),
(203, 'Time frame and frequency of the issue(s)', 2),
(204, 'Person(s) involved (If any)', 2),
(205, 'Attach additional evidence (If any) FILE:', 2),
(206, 'Would you like to require any additional help or specific actions regarding the issue(s)?', 2),
(207, 'What is your preferred contact (Phone or Email) for follow-up? (This will remain confidential)', 2),
(301, 'Issues CHECKBOX:Faulty Facility/Equipment|Cleanliness|Safety|Rules and regulations of the area', 3),
(302, 'Location DROPDOWN:SIIT Main Building, Rangsit|SIIT Edutivity Building, Rangsit|SIIT Advance Lab Building, Rangsit|SIIT Sirintharalai Building, Bangkadi|SIIT MT&IT Building, Bangkadi', 3),
(303, 'Details of the specific location (e.g., Floor, Room, or the specific part of the room)', 3),
(304, 'Time frame of discovering the issue(s)', 3),
(305, 'Describe problem details', 3),
(306, 'Attach additional evidence (If any) FILE:', 3),
(401, 'Issues CHECKBOX:Accessing faculty websites|Contacting staff/faculty departments|Class registration|Scholarship Inquiry|Requesting documents|General Inquiry|Faculty parking space', 4),
(402, 'State an approximate time frame and how often do you face this issue?', 4),
(403, 'Describe problem details', 4),
(404, 'Attach additional evidence (If any) FILE:', 4),
(405, 'Would you like to require any additional help or specific actions regarding the issue(s)?', 4),
(501, 'Issues * CHECKBOX:Publicity of news and updates|Updates and news not update to date|Difficulty following updates|Incomplete/Incorrect updates and news|Other issues regarding updates and news', 5),
(502, 'Describe the details of the issue(s) *', 5),
(503, 'Attach additional evidence (If any) FILE:', 5),
(504, 'Would you like to require any additional help or specific actions regarding the issue(s)?', 5);

-- --------------------------------------------------------

--
-- Table structure for table `resolution`
--

CREATE TABLE `resolution` (
  `ResID` int(11) NOT NULL,
  `ResDate` date DEFAULT NULL,
  `ResText` text,
  `AttachmentPath` varchar(255) DEFAULT NULL,
  `AdminID` int(11) DEFAULT NULL,
  `SubmissionID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `resolution`
--

INSERT INTO `resolution` (`ResID`, `ResDate`, `ResText`, `AttachmentPath`, `AdminID`, `SubmissionID`) VALUES
(1, '2025-11-11', 'The height standard has been changed; you are now considered tall', NULL, 1003, 3),
(2, '2025-11-11', 'We are in the process of writing a proposal for the institution', NULL, 101, 5);

-- --------------------------------------------------------

--
-- Table structure for table `staff`
--

CREATE TABLE `staff` (
  `StaffID` int(11) NOT NULL,
  `Division` varchar(100) DEFAULT NULL,
  `StaffName` varchar(255) DEFAULT NULL,
  `Password` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `staff`
--

INSERT INTO `staff` (`StaffID`, `Division`, `StaffName`, `Password`) VALUES
(101, 'Building', 'Staff_101', '$2y$10$kirF9/KUhclNtc2T3T1PreRhwxEUQnL1eTakX7XrlyAJUbKpCxN3W'),
(102, 'SA', 'Staff_102', '$2y$10$kirF9/KUhclNtc2T3T1PreRhwxEUQnL1eTakX7XrlyAJUbKpCxN3W'),
(103, 'IA-CR', 'Staff_103', '$2y$10$kirF9/KUhclNtc2T3T1PreRhwxEUQnL1eTakX7XrlyAJUbKpCxN3W'),
(104, 'Registration', 'Staff_104', '$2y$10$kirF9/KUhclNtc2T3T1PreRhwxEUQnL1eTakX7XrlyAJUbKpCxN3W'),
(105, 'Finance', 'Staff_105', '$2y$10$kirF9/KUhclNtc2T3T1PreRhwxEUQnL1eTakX7XrlyAJUbKpCxN3W'),
(106, 'Building', 'Staff_106', '$2y$10$kirF9/KUhclNtc2T3T1PreRhwxEUQnL1eTakX7XrlyAJUbKpCxN3W'),
(107, 'SA', 'Staff_107', '$2y$10$kirF9/KUhclNtc2T3T1PreRhwxEUQnL1eTakX7XrlyAJUbKpCxN3W'),
(108, 'IA-CR', 'Staff_108', '$2y$10$kirF9/KUhclNtc2T3T1PreRhwxEUQnL1eTakX7XrlyAJUbKpCxN3W'),
(109, 'Registration', 'Staff_109', '$2y$10$kirF9/KUhclNtc2T3T1PreRhwxEUQnL1eTakX7XrlyAJUbKpCxN3W'),
(110, 'Finance', 'Staff_110', '$2y$10$kirF9/KUhclNtc2T3T1PreRhwxEUQnL1eTakX7XrlyAJUbKpCxN3W');

-- --------------------------------------------------------

--
-- Table structure for table `status_log`
--

CREATE TABLE `status_log` (
  `LogID` int(11) NOT NULL,
  `SubmissionID` int(11) NOT NULL,
  `OldStatus` varchar(50) DEFAULT NULL,
  `NewStatus` varchar(50) DEFAULT NULL,
  `ChangeTimestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `status_log`
--

INSERT INTO `status_log` (`LogID`, `SubmissionID`, `OldStatus`, `NewStatus`, `ChangeTimestamp`) VALUES
(1, 3, 'Pending', 'Resolved', '2025-11-11 08:06:27'),
(2, 5, 'Pending', 'In Progress', '2025-11-11 08:26:17');

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `StudentID` bigint(20) NOT NULL,
  `StudentName` varchar(255) DEFAULT NULL,
  `Year` int(11) DEFAULT NULL,
  `Department` varchar(100) DEFAULT NULL,
  `Password` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`StudentID`, `StudentName`, `Year`, `Department`, `Password`) VALUES
(1000, 'Alice Smith', 1, 'DE', '$2y$10$LezBVDJU0Uqrt9FvL0AO0u6XHryW4Kwe1NDbKCOsH8cXH4TBDvxLC'),
(1001, 'Bob Johnson', 2, 'CPE', '$2y$10$LezBVDJU0Uqrt9FvL0AO0u6XHryW4Kwe1NDbKCOsH8cXH4TBDvxLC'),
(1002, 'Charlie Brown', 3, 'IE', '$2y$10$LezBVDJU0Uqrt9FvL0AO0u6XHryW4Kwe1NDbKCOsH8cXH4TBDvxLC'),
(1003, 'Dana Scully', 4, 'ME', '$2y$10$LezBVDJU0Uqrt9FvL0AO0u6XHryW4Kwe1NDbKCOsH8cXH4TBDvxLC'),
(1004, 'Eric Cartman', 1, 'CHE', '$2y$10$LezBVDJU0Uqrt9FvL0AO0u6XHryW4Kwe1NDbKCOsH8cXH4TBDvxLC'),
(1005, 'Fiona Glenanne', 2, 'EE', '$2y$10$LezBVDJU0Uqrt9FvL0AO0u6XHryW4Kwe1NDbKCOsH8cXH4TBDvxLC'),
(1006, 'George Clooney', 3, 'BA', '$2y$10$LezBVDJU0Uqrt9FvL0AO0u6XHryW4Kwe1NDbKCOsH8cXH4TBDvxLC'),
(1007, 'Hannah Baker', 4, 'CE', '$2y$10$LezBVDJU0Uqrt9FvL0AO0u6XHryW4Kwe1NDbKCOsH8cXH4TBDvxLC'),
(1008, 'Ivy Pepper', 1, 'DE', '$2y$10$LezBVDJU0Uqrt9FvL0AO0u6XHryW4Kwe1NDbKCOsH8cXH4TBDvxLC'),
(1009, 'Jack Reacher', 2, 'CPE', '$2y$10$LezBVDJU0Uqrt9FvL0AO0u6XHryW4Kwe1NDbKCOsH8cXH4TBDvxLC'),
(1010, 'Papaya Pokpok', 3, 'DE', '$2y$10$LezBVDJU0Uqrt9FvL0AO0u6XHryW4Kwe1NDbKCOsH8cXH4TBDvxLC'),
(1011, 'Pine Apple', 4, 'DE', '$2y$10$6B/$2y$10$LezBVDJU0Uqrt9FvL0AO0u6XHryW4Kwe1NDbKCOsH8cXH4TBDvxLC'),
(1012, 'banana potato', 3, 'IE', '$2y$10$eA5g3CT/$2y$10$LezBVDJU0Uqrt9FvL0AO0u6XHryW4Kwe1NDbKCOsH8cXH4TBDvxLC'),
(10000002, 'Generated Student 2', 2, 'ChE', '$2y$10$LezBVDJU0Uqrt9FvL0AO0u6XHryW4Kwe1NDbKCOsH8cXH4TBDvxLC');

-- --------------------------------------------------------

--
-- Table structure for table `submission`
--

CREATE TABLE `submission` (
  `SubmissionID` int(11) NOT NULL,
  `Date` date DEFAULT NULL,
  `Status` varchar(50) DEFAULT NULL,
  `StudentID` BIGINT DEFAULT NULL,
  `StaffID` int(11) DEFAULT NULL,
  `TopicID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `submission`
--

INSERT INTO `submission` (`SubmissionID`, `Date`, `Status`, `StudentID`, `StaffID`, `TopicID`) VALUES
(1, '2025-11-11', 'Pending', 1011, NULL, 3),
(2, '2025-11-11', 'Pending', 1011, NULL, 5),
(3, '2025-11-11', 'Resolved', 1006, NULL, 2),
(4, '2025-11-11', 'Pending', 10000002, NULL, 1),
(5, '2025-11-11', 'In Progress', 10000002, NULL, 4);

--
-- Triggers `submission`
--
DELIMITER $$
CREATE TRIGGER `trg_AfterSubmissionUpdate` AFTER UPDATE ON `submission` FOR EACH ROW BEGIN
    IF OLD.Status <> NEW.Status THEN
        INSERT INTO status_log (SubmissionID, OldStatus, NewStatus)
        VALUES (OLD.SubmissionID, OLD.Status, NEW.Status);
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `topic`
--

CREATE TABLE `topic` (
  `TopicID` int(11) NOT NULL,
  `Tname` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `topic`
--

INSERT INTO `topic` (`TopicID`, `Tname`) VALUES
(1, 'Academics'),
(2, 'Physical or Mental Abusements'),
(3, 'Area, Facilities, Amenities, and Welfare'),
(4, 'Faculty Systems and Staff Contact'),
(5, 'Follow ups, Updates, and News');

-- --------------------------------------------------------

--
-- Table structure for table `useranswer`
--

CREATE TABLE `useranswer` (
  `UAID` int(11) NOT NULL,
  `AnswerText` text,
  `QID` int(11) DEFAULT NULL,
  `SubmissionID` int(11) DEFAULT NULL,
  `AttachmentPath` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `useranswer`
--

INSERT INTO `useranswer` (`UAID`, `AnswerText`, `QID`, `SubmissionID`, `AttachmentPath`) VALUES
(1, 'Cleanliness', 301, 1, NULL),
(2, 'SIIT Main Building, Rangsit', 302, 1, NULL),
(3, '403, Main Building', 303, 1, NULL),
(4, '11/11/2025 \nIn the Morning', 304, 1, NULL),
(5, 'There is a lot of trash on the floor', 305, 1, NULL),
(6, '1_306_nRJcwGztlQHbSjsToS3D.webp', 306, 1, NULL),
(7, 'Publicity of news and updates', 501, 2, NULL),
(8, 'Didn\'t know SC has gears for sale', 502, 2, NULL),
(9, '2_503_Gear Draft.jpg', 503, 2, NULL),
(10, 'Would like another chance because I missed the deadline', 504, 2, NULL),
(11, 'Bullying', 201, 3, NULL),
(12, 'Was bullied for being short', 202, 3, NULL),
(13, 'everyday', 203, 3, NULL),
(14, 'Many people', 204, 3, NULL),
(15, '', 205, 3, NULL),
(16, 'Make me taller', 206, 3, NULL),
(17, 'xx@gmail.com', 207, 3, NULL),
(18, 'Teaching method is not conducive to learning, Lack/Unclear Communication', 101, 4, NULL),
(19, 'SED321', 102, 4, NULL),
(20, 'Every class', 103, 4, NULL),
(21, 'The professor doesn\'t care if the student understands or not; instead, she gets mad when students ask questions', 104, 4, NULL),
(22, 'make the class unlikable', 105, 4, NULL),
(23, 'New professor please', 106, 4, NULL),
(24, '', 107, 4, NULL),
(25, 'Accessing faculty websites, Requesting documents', 401, 5, NULL),
(26, 'last night 10/11/2025', 402, 5, NULL),
(27, 'Transcript costs 50 Baht; shouldn\'t it be free?', 403, 5, NULL),
(28, '', 404, 5, NULL),
(29, 'no\n', 405, 5, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`AdminID`),
  ADD KEY `FK_Admin_Staff` (`StaffID`),
  ADD KEY `FK_Admin_Student` (`StudentID`);

--
-- Indexes for table `question`
--
ALTER TABLE `question`
  ADD PRIMARY KEY (`QID`),
  ADD KEY `TopicID` (`TopicID`);

--
-- Indexes for table `resolution`
--
ALTER TABLE `resolution`
  ADD PRIMARY KEY (`ResID`),
  ADD KEY `AdminID` (`AdminID`),
  ADD KEY `FK_Resolution_Submission` (`SubmissionID`);

--
-- Indexes for table `staff`
--
ALTER TABLE `staff`
  ADD PRIMARY KEY (`StaffID`);

--
-- Indexes for table `status_log`
--
ALTER TABLE `status_log`
  ADD PRIMARY KEY (`LogID`),
  ADD KEY `SubmissionID` (`SubmissionID`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`StudentID`);

--
-- Indexes for table `submission`
--
ALTER TABLE `submission`
  ADD PRIMARY KEY (`SubmissionID`),
  ADD KEY `StudentID` (`StudentID`),
  ADD KEY `FK_Submission_Topic` (`TopicID`),
  ADD KEY `fk_staff_submission` (`StaffID`);

--
-- Indexes for table `topic`
--
ALTER TABLE `topic`
  ADD PRIMARY KEY (`TopicID`);

--
-- Indexes for table `useranswer`
--
ALTER TABLE `useranswer`
  ADD PRIMARY KEY (`UAID`),
  ADD KEY `QID` (`QID`),
  ADD KEY `FK_UserAnswer_Submission` (`SubmissionID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `resolution`
--
ALTER TABLE `resolution`
  MODIFY `ResID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `status_log`
--
ALTER TABLE `status_log`
  MODIFY `LogID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `submission`
--
ALTER TABLE `submission`
  MODIFY `SubmissionID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `useranswer`
--
ALTER TABLE `useranswer`
  MODIFY `UAID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admin`
--
ALTER TABLE `admin`
  ADD CONSTRAINT `FK_Admin_Staff` FOREIGN KEY (`StaffID`) REFERENCES `staff` (`StaffID`),
  ADD CONSTRAINT `admin_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `student` (`StudentID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `question`
--
ALTER TABLE `question`
  ADD CONSTRAINT `question_ibfk_1` FOREIGN KEY (`TopicID`) REFERENCES `topic` (`TopicID`);

--
-- Constraints for table `resolution`
--
ALTER TABLE `resolution`
  ADD CONSTRAINT `resolution_ibfk_1` FOREIGN KEY (`AdminID`) REFERENCES `admin` (`AdminID`),
  ADD CONSTRAINT `resolution_ibfk_2` FOREIGN KEY (`SubmissionID`) REFERENCES `submission` (`SubmissionID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `status_log`
--
ALTER TABLE `status_log`
  ADD CONSTRAINT `status_log_ibfk_1` FOREIGN KEY (`SubmissionID`) REFERENCES `submission` (`SubmissionID`) ON DELETE CASCADE;

--
-- Constraints for table `submission`
--
ALTER TABLE `submission`
  ADD CONSTRAINT `FK_Submission_Topic` FOREIGN KEY (`TopicID`) REFERENCES `topic` (`TopicID`),
  ADD CONSTRAINT `fk_staff_submission` FOREIGN KEY (`StaffID`) REFERENCES `staff` (`StaffID`),
  ADD CONSTRAINT `submission_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `student` (`StudentID`);

--
-- Constraints for table `useranswer`
--
ALTER TABLE `useranswer`
  ADD CONSTRAINT `useranswer_ibfk_1` FOREIGN KEY (`QID`) REFERENCES `question` (`QID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;