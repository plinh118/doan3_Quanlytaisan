CREATE DATABASE Academi_v4;



	CREATE TABLE users (
	  Id INT AUTO_INCREMENT PRIMARY KEY,
	  Email VARCHAR(255) NOT NULL UNIQUE,
	  Password VARCHAR(255) NOT NULL,
	  FullName VARCHAR(255) NOT NULL,
	  Role ENUM('admin', 'user') DEFAULT 'user',
	  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
	);
CREATE TABLE `Position` (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    PositionName NVARCHAR(50),
    IsDeleted BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Department(
    Id INT AUTO_INCREMENT PRIMARY KEY,
    DepartmentName NVARCHAR(50) NOT NULL,
    Description NVARCHAR(50) NULL,
    IsDeleted BOOLEAN DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Division(
    Id INT AUTO_INCREMENT PRIMARY KEY,
    DivisionName NVARCHAR(50) NOT NULL,
    DepartmentId INT,
    Description NVARCHAR(50) NULL,
    IsDeleted BOOLEAN DEFAULT 0,
    FOREIGN KEY (DepartmentId) REFERENCES Department(Id) ON UPDATE CASCADE ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Personnel (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    DivisionId INT,
    PersonnelName NVARCHAR(50) NOT NULL,
    PositionId INT,
    DateOfBirth DATE NULL,
    Gender NVARCHAR(10) NULL,  -- Thêm trường Giới tính
    Picture NVARCHAR(255) NULL,
    Email NVARCHAR(50),
    Description TEXT NULL,
    PhoneNumber VARCHAR(10) null,
    JoinDate DATE NULL,
    EndDate DATE NULL,
    WorkStatus NVARCHAR(50),
    IsDeleted TINYINT(1) DEFAULT 0,  -- Use TINYINT(1) for BOOLEAN
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (DivisionId) REFERENCES Division(Id) ON UPDATE CASCADE,
    FOREIGN KEY (PositionId) REFERENCES `Position`(Id) ON UPDATE CASCADE
);

CREATE TABLE Partner(
    Id INT AUTO_INCREMENT PRIMARY KEY,
    PartnerName NVARCHAR(50) NOT NULL,
    PhoneNumber VARCHAR(10) NULL,
    Email NVARCHAR(50) NULL,
    Address NVARCHAR(100) NULL,
    StartDate DATE NULL,
    EndDate DATE null,
    PartnershipStatus NVARCHAR(50),
    IsDeleted BOOLEAN DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Customer(
    Id INT AUTO_INCREMENT PRIMARY KEY,
    CustomerName NVARCHAR(50) NOT NULL,
    PhoneNumber VARCHAR(10) null,
    CustomerStatut NVARCHAR(20) NULL,
    Email NVARCHAR(50) null,
    Address NVARCHAR(50) null,
    IsDeleted BOOLEAN DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Project(
    Id INT AUTO_INCREMENT PRIMARY KEY,
    ProjectName NVARCHAR(50),
    DepartmentId INT,
    PartnerId INT null,
    Description TEXT NULL,
    ProjectStartDate DATE,
    ProjectEndDate DATE NULL,
    ProjectStatus NVARCHAR(50),
    CustomerId INT NULL, 
    IsDeleted BOOLEAN DEFAULT 0,
    FOREIGN KEY (DepartmentId) REFERENCES Department(Id) ON UPDATE CASCADE,
    FOREIGN KEY (PartnerId) REFERENCES Partner(Id) ON UPDATE CASCADE,
    FOREIGN KEY (CustomerId) REFERENCES Customer(Id) ON UPDATE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Product(
    Id INT AUTO_INCREMENT PRIMARY KEY,
    ProductName NVARCHAR(50),
    DepartmentId INT,
    ProductStartDate DATE,
    ProductEndDate DATE NULL,
    ProductStatus NVARCHAR(50),
    IsDeleted BOOLEAN DEFAULT 0,
    FOREIGN KEY (DepartmentId) REFERENCES Department(Id) ON UPDATE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Topic(
    Id INT AUTO_INCREMENT PRIMARY KEY,
    TopicName NVARCHAR(50),
    DepartmentId INT,
    TopicStartDate DATE,
    TopicEndDate DATE NULL,
    Description TEXT NULL,
    TopicStatus NVARCHAR(50),
    IsDeleted BOOLEAN DEFAULT 0,
    FOREIGN KEY (DepartmentId) REFERENCES Department(Id) ON UPDATE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE TrainingCourse(
    Id INT AUTO_INCREMENT PRIMARY KEY,
    CourseName NVARCHAR(100),
    ServiceStatus NVARCHAR(50),
    Description TEXT NULL,
    Duration INT,
    InstructorId INT,
    IsDeleted BOOLEAN DEFAULT 0,
    FOREIGN KEY (InstructorId) REFERENCES Personnel(Id) ON UPDATE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Service(
    Id INT AUTO_INCREMENT PRIMARY KEY,
    ServiceName NVARCHAR(100),
    Description TEXT NULL,
    ServiceStatus NVARCHAR(50),
    IsDeleted BOOLEAN DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE IntellectualProperty(
    Id INT AUTO_INCREMENT PRIMARY KEY,
    DepartmentId INT,
    IntellectualPropertyName NVARCHAR(100),
   IntellectualPropertyImage TEXT NULL,
    Description TEXT NULL,
    IntellectualPropertyStatus NVARCHAR(50),
    IsDeleted BOOLEAN DEFAULT 0,
    FOREIGN KEY (DepartmentId) REFERENCES Department(Id),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Document(
    Id INT AUTO_INCREMENT PRIMARY KEY,
    DocumentName NVARCHAR(50) NOT NULL,
    DocumentLink TEXT NOT NULL,
    RelatedId INT NOT NULL,
    RelatedType NVARCHAR(50) NOT NULL,
    IsDeleted BOOLEAN DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Customer_Link(
    CustomerId INT,
    RelatedId INT,
    RelatedType NVARCHAR(50),
    PRIMARY KEY(CustomerId, RelatedId, RelatedType),
    FOREIGN KEY (CustomerId) REFERENCES Customer(Id),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE Asset(
	Id NVARCHAR(100) primary KEY,
    AssetName NVARCHAR(100) NOT NULL,
    AssetType NVARCHAR(100) NOT NULL,
    DivisionId INT,
    PersonnelId INT NULL,
     Quantity INT NULL,
    Price float,
    StatDate Date Null,
    StatusAsset nvarchar(50),
    Description TEXT NULL,
     IsDeleted BOOLEAN DEFAULT 0,
       FOREIGN KEY (DivisionId) REFERENCES Division(Id),
        FOREIGN KEY (PersonnelId) REFERENCES Personnel(Id),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
-- ADD DATA
INSERT INTO `Position` (PositionName, IsDeleted) VALUES
('Software Engineer', 0),
('Project Manager', 0),
('Business Analyst', 0),
('HR Manager', 0),
('Sales Manager', 0);

INSERT INTO Department (DepartmentName, Description, IsDeleted) VALUES
('Engineering', 'Responsible for developing software solutions', 0),
('HR', 'Handles recruitment and employee relations', 0),
('Sales', 'Manages customer relationships and sales', 0),
('Finance', 'Manages company finances', 0);

INSERT INTO Division (DivisionName, DepartmentId, Description, IsDeleted) VALUES
('Development Division', 1, 'Develops and maintains software products', 0),
('QA Division', 1, 'Ensures software quality and testing', 0),
('Sales Division', 3, 'Handles sales operations and customer support', 0);

INSERT INTO Personnel (DivisionId, PersonnelName, PositionId, DateOfBirth, Email, Description, PhoneNumber, JoinDate, WorkStatus, IsDeleted) VALUES
(1, 'Alice Johnson', 1, '1985-03-15', 'alice.johnson@example.com', 'Software developer with 5 years of experience in Java and Python', '1234567890', '2015-06-01', 'Active', 0),
(2, 'Bob Smith', 2, '1980-07-21', 'bob.smith@example.com', 'Project manager with 10 years of experience', '0987654321', '2010-02-15', 'Active', 0),
(3, 'Charlie Brown', 3, '1990-11-12', 'charlie.brown@example.com', 'Sales professional with expertise in B2B sales', '1122334455', '2018-08-01', 'Active', 0);

INSERT INTO Partner (PartnerName, PhoneNumber, Email, Address, StartDate, PartnershipStatus, IsDeleted) VALUES
('Tech Solutions Ltd.', '1231231234', 'contact@techsolutions.com', '123 Tech Street, City', '2020-01-15', 'Active', 0),
('Innovative Software Co.', '5675675678', 'contact@innosoft.com', '456 Innovation Blvd, Tech City', '2019-11-20', 'Active', 0);

INSERT INTO Customer (CustomerName, PhoneNumber, Email, Address, IsDeleted) VALUES
('John Doe', '5551234567', 'john.doe@example.com', '789 Customer St, City', 0),
('Jane Smith', '5557654321', 'jane.smith@example.com', '123 Client Rd, Tech City', 0);

INSERT INTO Project (ProjectName, DepartmentId, PartnerId, Description, ProjectStartDate, ProjectEndDate, ProjectStatus, DocumentLink, IsDeleted) VALUES
('Website Development', 1, 1, 'Develop a new e-commerce platform', '2024-01-01', '2024-12-31', 'In Progress', 'http://example.com/docs/project1', 0),
('Mobile App Development', 1, 2, 'Develop a mobile application for client XYZ', '2024-03-01', '2024-11-30', 'In Progress', 'http://example.com/docs/project2', 0);

INSERT INTO Product (ProductName, DepartmentId, ProductStartDate, ProductEndDate, ProductStatus, DocumentLink, IsDeleted) VALUES
('Web Application', 1, '2024-01-01', '2024-12-31', 'In Development', 'http://example.com/docs/product1', 0),
('Mobile App', 1, '2024-03-01', '2024-11-30', 'In Development', 'http://example.com/docs/product2', 0);

INSERT INTO Topic (TopicName, DepartmentId, TopicStartDate, TopicEndDate, Description, TopicStatus, DocumentLink, IsDeleted) VALUES
('Cloud Computing', 1, '2024-01-01', '2024-06-30', 'Research on cloud technologies for software development', 'Active', 'http://example.com/docs/topic1', 0),
('AI in Business', 1, '2024-02-01', '2024-07-31', 'Investigating the use of AI in business applications', 'Active', 'http://example.com/docs/topic2', 0);

INSERT INTO TrainingCourse (CourseName, ServiceStatus, Description, Duration, InstructorId, IsDeleted) VALUES
('Java Development Basics', 'Active', 'A beginner course on Java programming', 30, 1, 0),
('Project Management Essentials', 'Active', 'An introductory course on managing projects', 40, 2, 0);


INSERT INTO Service (ServiceName, Description, ServiceStatus, IsDeleted) VALUES
('Cloud Hosting', 'Provides scalable cloud hosting solutions for clients', 'Active', 0),
('Mobile App Development', 'Mobile app development services for businesses', 'Active', 0);

INSERT INTO IntellectualProperty (DepartmentId, IntellectualPropertyName, IntellectualPropertyImage, Description, IntellectualPropertyStatus, IsDeleted) VALUES
(1, 'Cloud Software Framework', NULL, 'A software framework for cloud computing', 'Active', 0),
(1, 'AI Algorithm for Business', NULL, 'An algorithm for AI-powered business solutions', 'Active', 0);

INSERT INTO Document (DocumentName, DocumentLink, RelatedId, RelatedType, IsDeleted) VALUES
('Project Proposal - Website Development', 'http://example.com/docs/proposal1', 1, 'Project', 0),
('API Documentation - Mobile App', 'http://example.com/docs/api1', 2, 'Project', 0);

INSERT INTO Customer_Link (CustomerId, RelatedId, RelatedType) VALUES
(1, 1, 'Project'),
(2, 2, 'Project');


CALL AddPersonnel(7, N'Nguyễn Văn A', 17, '1990-01-15', N'Nam', 'https://example.com/pic1.jpg', 'a@example.com', 'Nhân viên phòng kỹ thuật', '0987654321', '2024-01-01', NULL, N'Đang làm việc');
CALL AddPersonnel(7, N'Trần Thị B', 17, '1992-03-22', N'Nữ', 'https://example.com/pic2.jpg', 'b@example.com', 'Nhân viên phòng hành chính', '0987654322', '2024-01-02', NULL, N'Đang làm việc');
CALL AddPersonnel(7, N'Phạm Văn C', 17, '1988-07-11', N'Nam', 'https://example.com/pic3.jpg', 'c@example.com', 'Nhân viên phòng kinh doanh', '0987654323', '2024-01-03', NULL, N'Đang làm việc');
CALL AddPersonnel(8, N'Lê Thị D', 18, '1995-05-14', N'Nữ', 'https://example.com/pic4.jpg', 'd@example.com', 'Nhân viên phòng tài chính', '0987654324', '2024-01-04', NULL, N'Đang làm việc');
CALL AddPersonnel(8, N'Hoàng Văn E', 18, '1985-09-30', N'Nam', 'https://example.com/pic5.jpg', 'e@example.com', 'Nhân viên phòng kỹ thuật', '0987654325', '2024-01-05', NULL, N'Đang làm việc');
CALL AddPersonnel(8, N'Vũ Thị F', 18, '1997-08-19', N'Nữ', 'https://example.com/pic6.jpg', 'f@example.com', 'Nhân viên phòng hành chính', '0987654326', '2024-01-06', NULL, N'Đang làm việc');
CALL AddPersonnel(9, N'Đặng Văn G', 19, '1991-12-12', N'Nam', 'https://example.com/pic7.jpg', 'g@example.com', 'Nhân viên phòng kinh doanh', '0987654327', '2024-01-07', NULL, N'Đang làm việc');
CALL AddPersonnel(9, N'Bùi Thị H', 20, '1989-04-18', N'Nữ', 'https://example.com/pic8.jpg', 'h@example.com', 'Nhân viên phòng tài chính', '0987654328', '2024-01-08', NULL, N'Đang làm việc');
CALL AddPersonnel(9, N'Ngô Văn I', 20, '1994-06-25', N'Nam', 'https://example.com/pic9.jpg', 'i@example.com', 'Nhân viên phòng kỹ thuật', '0987654329', '2024-01-09', NULL, N'Đang làm việc');
CALL AddPersonnel(12, N'Phan Thị J', 21, '1993-11-09', N'Nữ', 'https://example.com/pic10.jpg', 'j@example.com', 'Nhân viên phòng hành chính', '0987654330', '2024-01-10', NULL, N'Đang làm việc');
CALL AddPersonnel(12, N'Nguyễn Văn K', 18, '1990-02-01', N'Nam', 'https://example.com/pic11.jpg', 'k@example.com', 'Nhân viên phòng kỹ thuật', '0987654331', '2024-01-11', NULL, N'Đang làm việc');
CALL AddPersonnel(12, N'Trần Thị L', 22, '1992-03-03', N'Nữ', 'https://example.com/pic12.jpg', 'l@example.com', 'Nhân viên phòng hành chính', '0987654332', '2024-01-12', NULL, N'Đang làm việc');
CALL AddPersonnel(12, N'Phạm Văn M', 23, '1988-07-07', N'Nam', 'https://example.com/pic13.jpg', 'm@example.com', 'Nhân viên phòng kinh doanh', '0987654333', '2024-01-13', NULL, N'Đang làm việc');
CALL AddPersonnel(9, N'Lê Thị N', 18, '1995-05-05', N'Nữ', 'https://example.com/pic14.jpg', 'n@example.com', 'Nhân viên phòng tài chính', '0987654334', '2024-01-14', NULL, N'Đang làm việc');
CALL AddPersonnel(8, N'Hoàng Văn O', 17, '1985-09-09', N'Nam', 'https://example.com/pic15.jpg', 'o@example.com', 'Nhân viên phòng kỹ thuật', '0987654335', '2024-01-15', NULL, N'Đang làm việc');
CALL AddPersonnel(8, N'Vũ Thị P', 18, '1997-08-08', N'Nữ', 'https://example.com/pic16.jpg', 'p@example.com', 'Nhân viên phòng hành chính', '0987654336', '2024-01-16', NULL, N'Đang làm việc');
CALL AddPersonnel(7, N'Đặng Văn Q', 19, '1991-12-12', N'Nam', 'https://example.com/pic17.jpg', 'q@example.com', 'Nhân viên phòng kinh doanh', '0987654337', '2024-01-17', NULL, N'Đang làm việc');
CALL AddPersonnel(8, N'Bùi Thị R', 20, '1989-04-04', N'Nữ', 'https://example.com/pic18.jpg', 'r@example.com', 'Nhân viên phòng tài chính', '0987654338', '2024-01-18', NULL, N'Đang làm việc');
CALL AddPersonnel(9, N'Ngô Văn S', 21, '1994-06-06', N'Nam', 'https://example.com/pic19.jpg', 's@example.com', 'Nhân viên phòng kỹ thuật', '0987654339', '2024-01-19', NULL, N'Đang làm việc');
CALL AddPersonnel(7, N'Phan Thị T', 22, '1993-11-11', N'Nữ', 'https://example.com/pic20.jpg', 't@example.com', 'Nhân viên phòng hành chính', '0987654340', '2024-01-20', NULL, N'Đang làm việc');

