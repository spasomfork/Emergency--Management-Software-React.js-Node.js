-- phpMyAdmin SQL Dump
-- version 5.1.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3307
-- Generation Time: Aug 23, 2024 at 12:34 PM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 7.4.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `emergency management software`
--

-- --------------------------------------------------------

--
-- Table structure for table `chat`
--

CREATE TABLE `chat` (
  `ChatID` int(11) NOT NULL,
  `UserID` int(11) DEFAULT NULL,
  `Message` text DEFAULT NULL,
  `Timestamp` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `damagereport`
--

CREATE TABLE `damagereport` (
  `ReportID` int(11) NOT NULL,
  `IncidentID` int(11) DEFAULT NULL,
  `Location` varchar(255) DEFAULT NULL,
  `DamageDescription` text DEFAULT NULL,
  `Severity` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `evacuationcenter`
--

CREATE TABLE `evacuationcenter` (
  `CenterID` int(11) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Location` varchar(255) DEFAULT NULL,
  `Capacity` int(11) DEFAULT NULL,
  `AvailabilityStatus` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `evacuationcenter`
--

INSERT INTO `evacuationcenter` (`CenterID`, `Name`, `Location`, `Capacity`, `AvailabilityStatus`) VALUES
(2, 'Matara Temporary Shelter', 'Matara', 20, 'Active'),
(4, 'Galle Disaster Relief Center', 'Galle', 100, 'Active'),
(5, 'Trincomalee Evacuation Site', 'Trincomalee', 400, 'Deactive');

-- --------------------------------------------------------

--
-- Table structure for table `hospital`
--

CREATE TABLE `hospital` (
  `HospitalID` int(11) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Location` varchar(255) DEFAULT NULL,
  `Status` varchar(100) NOT NULL,
  `Capacity` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `hospital`
--

INSERT INTO `hospital` (`HospitalID`, `Name`, `Location`, `Status`, `Capacity`) VALUES
(2, 'Hemas', 'Colombo', 'Active', 122),
(13, 'Central Hospital', 'Colombo 05', 'Operational', 500),
(14, 'Nawalapitiya District Hospital', 'Nawalapitiya', 'Operational', 250),
(15, 'Kandy General Hospital', 'Kandy', 'Operational', 750),
(16, 'Jaffna Teaching Hospital', 'Jaffna', 'Inactive', 600);

-- --------------------------------------------------------

--
-- Table structure for table `incident`
--

CREATE TABLE `incident` (
  `IncidentID` int(11) NOT NULL,
  `Title` varchar(255) NOT NULL,
  `Description` text DEFAULT NULL,
  `Status` varchar(50) DEFAULT NULL,
  `Date` date NOT NULL,
  `Latitude` decimal(8,6) NOT NULL,
  `Longitude` decimal(9,6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `incident`
--

INSERT INTO `incident` (`IncidentID`, `Title`, `Description`, `Status`, `Date`, `Latitude`, `Longitude`) VALUES
(1, 'Flood in Colombo', 'Some parts of Colombo are submerged in flood', 'High', '2024-08-20', '7.193237', '79.851135'),
(2, 'Landslide in Kandy', 'A landslide in Kandy blocks the main Kandy road', 'Low', '2024-08-20', '7.284865', '80.660429'),
(5, 'Flood', 'Flood in Wattala', 'High', '2024-08-21', '8.043228', '80.466103');

-- --------------------------------------------------------

--
-- Table structure for table `inventory`
--

CREATE TABLE `inventory` (
  `InventoryID` int(11) NOT NULL,
  `ItemName` varchar(255) NOT NULL,
  `Quantity` int(11) DEFAULT NULL,
  `Location` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `lifelinenumber`
--

CREATE TABLE `lifelinenumber` (
  `NumberID` int(11) NOT NULL,
  `ServiceName` varchar(255) NOT NULL,
  `ContactNumber` int(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `lifelinenumber`
--

INSERT INTO `lifelinenumber` (`NumberID`, `ServiceName`, `ContactNumber`) VALUES
(1, 'Sri Lanka Police Emergency', 119),
(2, ' Ambulance Service', 1990),
(3, 'Sri Lanka Fire Department', 110),
(4, 'Disaster Management Center', 117),
(5, 'National Child Protection Authority', 1929),
(6, 'Women\'s Help Line', 1938),
(7, 'Sri Lanka Red Cross Society', 11),
(8, 'National Blood Transfusion Service', 11),
(9, 'Sri Lanka Wildlife Emergency', 11),
(10, 'Colombo Municipal Council', 11),
(11, 'Roadside Assistance (Sri Lanka Automobile Association)', 11),
(12, 'Tourist Police', 11);

-- --------------------------------------------------------

--
-- Table structure for table `newsalert`
--

CREATE TABLE `newsalert` (
  `AlertID` int(11) NOT NULL,
  `Title` varchar(255) NOT NULL,
  `Content` text DEFAULT NULL,
  `DateTime` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `personnel`
--

CREATE TABLE `personnel` (
  `PersonnelID` int(11) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Role` varchar(255) DEFAULT NULL,
  `ContactInformation` varchar(255) DEFAULT NULL,
  `Password` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `personnel`
--

INSERT INTO `personnel` (`PersonnelID`, `Name`, `Role`, `ContactInformation`, `Password`) VALUES
(1, 'Pramuka', 'Admin', '0762529400', '123'),
(3, 'jnsif', 'vwmw', '1234', '1vcw'),
(4, 'Mihiri', 'Manager', '076252400', '123'),
(5, 'Mihiri', 'User', '07783666', '234'),
(6, 'John', 'Driver', '76252398', '456');

-- --------------------------------------------------------

--
-- Table structure for table `reportcategory`
--

CREATE TABLE `reportcategory` (
  `CategoryID` int(11) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `resource`
--

CREATE TABLE `resource` (
  `ResourceID` int(11) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Quantity` int(11) DEFAULT NULL,
  `Type` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `RoleID` int(11) NOT NULL,
  `RoleName` varchar(255) NOT NULL,
  `Description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `shelter`
--

CREATE TABLE `shelter` (
  `ShelterID` int(11) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Location` varchar(255) DEFAULT NULL,
  `Capacity` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `task`
--

CREATE TABLE `task` (
  `TaskID` int(11) NOT NULL,
  `Title` varchar(255) NOT NULL,
  `Description` text DEFAULT NULL,
  `Status` varchar(50) DEFAULT 'InProgress',
  `AssignedTo` varchar(100) DEFAULT NULL,
  `DueDate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `task`
--

INSERT INTO `task` (`TaskID`, `Title`, `Description`, `Status`, `AssignedTo`, `DueDate`) VALUES
(1, 'Help', 'Help the affected', 'InProgress', 'Pramuka', '2024-08-12'),
(3, 'Distribute', 'Distribute food to affected people', 'InProgress', 'Kasun', '2024-08-15'),
(5, 'Search and Rescue', 'Search and rescue people in flooded area', 'InProgress', 'Nadeeka', '2024-08-29');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `UserID` int(11) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `RoleID` int(11) DEFAULT NULL,
  `ContactInformation` varchar(255) DEFAULT NULL,
  `Login` datetime DEFAULT NULL,
  `Logout` datetime DEFAULT NULL,
  `UpdatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `volunteer`
--

CREATE TABLE `volunteer` (
  `VolunteerID` int(11) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Skills` text DEFAULT NULL,
  `Availability` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chat`
--
ALTER TABLE `chat`
  ADD PRIMARY KEY (`ChatID`),
  ADD KEY `UserID` (`UserID`);

--
-- Indexes for table `damagereport`
--
ALTER TABLE `damagereport`
  ADD PRIMARY KEY (`ReportID`),
  ADD KEY `damagereport_ibfk_1` (`IncidentID`);

--
-- Indexes for table `evacuationcenter`
--
ALTER TABLE `evacuationcenter`
  ADD PRIMARY KEY (`CenterID`);

--
-- Indexes for table `hospital`
--
ALTER TABLE `hospital`
  ADD PRIMARY KEY (`HospitalID`);

--
-- Indexes for table `incident`
--
ALTER TABLE `incident`
  ADD PRIMARY KEY (`IncidentID`);

--
-- Indexes for table `inventory`
--
ALTER TABLE `inventory`
  ADD PRIMARY KEY (`InventoryID`);

--
-- Indexes for table `lifelinenumber`
--
ALTER TABLE `lifelinenumber`
  ADD PRIMARY KEY (`NumberID`);

--
-- Indexes for table `newsalert`
--
ALTER TABLE `newsalert`
  ADD PRIMARY KEY (`AlertID`);

--
-- Indexes for table `personnel`
--
ALTER TABLE `personnel`
  ADD PRIMARY KEY (`PersonnelID`);

--
-- Indexes for table `reportcategory`
--
ALTER TABLE `reportcategory`
  ADD PRIMARY KEY (`CategoryID`);

--
-- Indexes for table `resource`
--
ALTER TABLE `resource`
  ADD PRIMARY KEY (`ResourceID`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`RoleID`);

--
-- Indexes for table `shelter`
--
ALTER TABLE `shelter`
  ADD PRIMARY KEY (`ShelterID`);

--
-- Indexes for table `task`
--
ALTER TABLE `task`
  ADD PRIMARY KEY (`TaskID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`UserID`),
  ADD KEY `RoleID` (`RoleID`);

--
-- Indexes for table `volunteer`
--
ALTER TABLE `volunteer`
  ADD PRIMARY KEY (`VolunteerID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `evacuationcenter`
--
ALTER TABLE `evacuationcenter`
  MODIFY `CenterID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `hospital`
--
ALTER TABLE `hospital`
  MODIFY `HospitalID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `incident`
--
ALTER TABLE `incident`
  MODIFY `IncidentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `lifelinenumber`
--
ALTER TABLE `lifelinenumber`
  MODIFY `NumberID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `personnel`
--
ALTER TABLE `personnel`
  MODIFY `PersonnelID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `task`
--
ALTER TABLE `task`
  MODIFY `TaskID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `chat`
--
ALTER TABLE `chat`
  ADD CONSTRAINT `chat_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`);

--
-- Constraints for table `damagereport`
--
ALTER TABLE `damagereport`
  ADD CONSTRAINT `damagereport_ibfk_1` FOREIGN KEY (`IncidentID`) REFERENCES `incident` (`IncidentID`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`RoleID`) REFERENCES `role` (`RoleID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
