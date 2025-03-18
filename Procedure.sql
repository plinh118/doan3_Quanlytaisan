USE Academi_v4;

DELIMITER $$

-- Thêm Position
CREATE PROCEDURE AddPosition(
    IN p_PositionName NVARCHAR(50)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;
    
    INSERT INTO `Position` (PositionName) 
    VALUES (p_PositionName);
    
    SELECT 0 AS RESULT;
END$$

-- Cập nhật Position
CREATE PROCEDURE UpdatePosition(
    IN p_Id INT,
    IN p_PositionName NVARCHAR(50)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;
    
    UPDATE `Position`
    SET PositionName = p_PositionName
    WHERE Id = p_Id AND IsDeleted = 0;
    
    SELECT 0 AS RESULT;
END$$

-- Xóa mềm Position
CREATE PROCEDURE DeletePosition(
    IN p_Id INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;
    
    UPDATE `Position`
    SET IsDeleted = 1
    WHERE Id = p_Id;
    
    SELECT 0 AS RESULT;
END$$

-- Lấy danh sách Position

DELIMITER $$

CREATE PROCEDURE GetPositionsByPageOrder(
    IN p_PageIndex INT,         -- Trang hiện tại
    IN p_PageSize INT,          -- Số dòng trên mỗi trang
    IN p_OrderType VARCHAR(4),  -- 'ASC' hoặc 'DESC'
    IN p_PositionName VARCHAR(255)  -- Tên vị trí cần tìm (có thể NULL)
)
BEGIN
    DECLARE v_Offset INT;
    DECLARE v_PositionFilter VARCHAR(400);
    SET v_Offset = (p_PageIndex - 1) * p_PageSize;

    -- Xử lý điều kiện tìm kiếm
    IF p_PositionName IS NOT NULL AND p_PositionName != '' THEN
        SET v_PositionFilter = CONCAT(" AND PositionName LIKE '%", p_PositionName, "%' ");
    ELSE
        SET v_PositionFilter = "";
    END IF;

    -- Xây dựng SQL lấy danh sách vị trí kèm tổng số bản ghi
    SET @sql = CONCAT(
        'SELECT *, COUNT(*) OVER () AS TotalRecords FROM Position WHERE isdeleted=0',
        v_PositionFilter,
        ' ORDER BY PositionName ', p_OrderType,
        ' LIMIT ', p_PageSize, ' OFFSET ', v_Offset
    );

    -- Debug câu SQL (nếu cần kiểm tra)
    -- SELECT @sql;

    -- Thực thi SQL động
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END$$

DELIMITER ;



-- Department

DELIMITER $$


CREATE PROCEDURE AddDepartment(
    IN p_DepartmentName NVARCHAR(50),
    IN p_Descripttion NVARCHAR(250)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;
    
    INSERT INTO Department (DepartmentName,Description ) 
    VALUES (p_DepartmentName,p_Descripttion);
    
    SELECT 0 AS RESULT;
END$$


CREATE PROCEDURE UpdateDepartment(
    IN p_Id INT,
	IN p_DepartmentName NVARCHAR(50),
    IN p_Description NVARCHAR(250)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;
    
    UPDATE Department
    SET DepartmentName = p_DepartmentName,Description=p_Description
    WHERE Id = p_Id AND IsDeleted = 0;
    
    SELECT 0 AS RESULT;
END$$


CREATE PROCEDURE DeleteDepartment(
    IN p_Id INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;
    
    UPDATE Department
    SET IsDeleted = 1
    WHERE Id = p_Id;
    
    SELECT 0 AS RESULT;
END$$

DELIMITER $$

CREATE PROCEDURE GetDepartmentByPageOrder(
    IN p_PageIndex INT,
    IN p_PageSize INT,
    IN p_OrderType VARCHAR(4),
    IN p_DepartmentName VARCHAR(255)
)
BEGIN
    DECLARE v_Offset INT;
    SET v_Offset = (p_PageIndex - 1) * p_PageSize;

    -- Truy vấn danh sách Department cùng số lượng Division của từng Department
    SELECT 
        d.Id AS Department,
        d.DepartmentName,
        d.Description,
        COUNT(dv.Id) AS TotalDivisions,  -- Đếm số lượng Division
        COUNT(*) OVER () AS TotalRecords
    FROM Department d
    LEFT JOIN Division dv ON d.Id = dv.DepartmentId AND dv.IsDeleted = 0  -- Đổi bí danh từ 'div' thành 'dv'
    WHERE d.IsDeleted = 0
        AND (p_DepartmentName IS NULL OR p_DepartmentName = '' OR d.DepartmentName LIKE CONCAT('%', p_DepartmentName, '%'))
    GROUP BY d.Id, d.DepartmentName, d.Description
    ORDER BY d.DepartmentName 
    LIMIT p_PageSize OFFSET v_Offset;
END$$

DELIMITER ;



DELIMITER ;


-- Division

DELIMITER $$

CREATE PROCEDURE AddDivision(
    IN d_DivisionName NVARCHAR(50),
    IN d_DepartmentId INT,
    IN d_Description NVARCHAR(250)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;
    
    INSERT INTO Division (DivisionName,DepartmentId,Description) 
    VALUES (d_DivisionName,d_DepartmentId,d_Description);
    
    SELECT 0 AS RESULT;
END$$

CREATE PROCEDURE UpdateDivision(
    IN p_Id INT,
    IN d_DivisionName NVARCHAR(50),
    IN d_DepartmentId INT,
    IN d_Description NVARCHAR(250)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;
    
    UPDATE Division
    SET DivisionName = d_DivisionName,
    DepartmentId=d_DepartmentId,
    Description=d_Description
    WHERE Id = p_Id AND IsDeleted = 0;
    
    SELECT 0 AS RESULT;
END$$

CREATE PROCEDURE DeleteDivision(
    IN p_Id INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;
    
    UPDATE Division
    SET IsDeleted = 1
    WHERE Id = p_Id;
    
    SELECT 0 AS RESULT;
END$$

 
DELIMITER $$

CREATE PROCEDURE GetPartnerByPageOrder(
    IN p_PageIndex INT,         -- Trang hiện tại
    IN p_PageSize INT,          -- Số dòng trên mỗi trang
    IN p_OrderType VARCHAR(4),  -- 'ASC' hoặc 'DESC'
    IN p_PartnerName VARCHAR(255),
    IN p_PhoneNumber VARCHAR(10)
)
BEGIN
    DECLARE v_Offset INT;
    DECLARE v_FilterCondition VARCHAR(1000);
    
    SET v_Offset = (p_PageIndex - 1) * p_PageSize;
    SET v_FilterCondition = ' WHERE isdeleted = 0 ';  -- Bắt đầu với điều kiện isdeleted = 0

    -- Xây dựng điều kiện WHERE dựa trên giá trị đầu vào
    IF p_PartnerName IS NOT NULL AND p_PartnerName <> '' THEN
        SET v_FilterCondition = CONCAT(v_FilterCondition, " AND PartnerName LIKE '%", p_PartnerName, "%' ");
    END IF;
    
    IF p_PhoneNumber IS NOT NULL AND p_PhoneNumber <> '' THEN
        SET v_FilterCondition = CONCAT(v_FilterCondition, " AND PhoneNumber LIKE '%", p_PhoneNumber, "%' ");
    END IF;

    -- Lấy tổng số bản ghi phù hợp với điều kiện
    SET @sql_count = CONCAT(
        'SELECT COUNT(*) INTO @TotalRecords FROM Partner ', v_FilterCondition
    );
    PREPARE stmt_count FROM @sql_count;
    EXECUTE stmt_count;
    DEALLOCATE PREPARE stmt_count;

    -- Lấy danh sách đối tác với phân trang
    SET @sql = CONCAT(
        'SELECT *, @TotalRecords AS TotalRecords FROM Partner ',
        v_FilterCondition,
        ' ORDER BY PartnerName ', p_OrderType,
        ' LIMIT ', p_PageSize, ' OFFSET ', v_Offset
    );

    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END$$

DELIMITER ;

DELIMITER ;


-- Partner

	DELIMITER $$

CREATE PROCEDURE GetPartnerByPageOrder(
    IN p_PageIndex INT,         -- Trang hiện tại
    IN p_PageSize INT,          -- Số dòng trên mỗi trang
    IN p_OrderType VARCHAR(4),  -- 'ASC' hoặc 'DESC'
    IN p_PartnerName VARCHAR(255),
    IN p_PhoneNumber VARCHAR(10)
)
BEGIN
    DECLARE v_Offset INT;
    DECLARE v_FilterCondition VARCHAR(500);
    
    SET v_Offset = (p_PageIndex - 1) * p_PageSize;
    SET v_FilterCondition = '';

    -- Xây dựng điều kiện WHERE dựa trên giá trị đầu vào
    IF p_PartnerName IS NOT NULL AND p_PartnerName <> '' THEN
        SET v_FilterCondition = CONCAT(" PartnerName LIKE '%", p_PartnerName, "%' ");
    END IF;
    
    IF p_PhoneNumber IS NOT NULL AND p_PhoneNumber <> '' THEN
        IF v_FilterCondition <> '' THEN
            SET v_FilterCondition = CONCAT(v_FilterCondition, " AND ");
        END IF;
        SET v_FilterCondition = CONCAT(v_FilterCondition, " PhoneNumber LIKE '%", p_PhoneNumber, "%' ");
    END IF;
    
    -- Kiểm tra xem có điều kiện WHERE không
    IF v_FilterCondition <> '' THEN
        SET v_FilterCondition = CONCAT(" WHERE ", v_FilterCondition);
    END IF;

    -- Tạo câu truy vấn động
    SET @sql = CONCAT(
        'SELECT * FROM Partner where isdeleted=0',  
        v_FilterCondition,
        ' ORDER BY PartnerName ', p_OrderType,
        ' LIMIT ', p_PageSize, ' OFFSET ', v_Offset
    );

   
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END$$

DELIMITER ;
DELIMITER $$

-- Thêm mới Partner
CREATE PROCEDURE AddPartner(
    IN p_PartnerName NVARCHAR(50),
    IN p_PhoneNumber VARCHAR(10),
    IN p_Email NVARCHAR(50),
    IN p_Address NVARCHAR(100),
    IN p_StartDate DATE,
    IN p_EndDate DATE, -- Có thể NULL
    IN p_PartnershipStatus NVARCHAR(50)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;

    INSERT INTO Partner (PartnerName, PhoneNumber, Email, Address, StartDate, EndDate, PartnershipStatus)
    VALUES (p_PartnerName, p_PhoneNumber, p_Email, p_Address, p_StartDate, 
        IFNULL(p_EndDate, NULL), -- Đảm bảo NULL nếu không nhập
        p_PartnershipStatus
    );

    SELECT 0 AS RESULT;
END$$

-- Cập nhật Partner
CREATE PROCEDURE UpdatePartner(
    IN p_Id INT,
    IN p_PartnerName NVARCHAR(50),
    IN p_PhoneNumber VARCHAR(10),
    IN p_Email NVARCHAR(50),
    IN p_Address NVARCHAR(100),
    IN p_StartDate DATE,
    IN p_EndDate DATE, -- Có thể NULL
    IN p_PartnershipStatus NVARCHAR(50)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;

    UPDATE Partner
    SET 
        PartnerName = p_PartnerName,
        PhoneNumber = p_PhoneNumber,
        Email = p_Email,
        Address = p_Address,
        StartDate = p_StartDate,
        EndDate = IFNULL(p_EndDate, NULL), -- Đảm bảo NULL nếu không nhập
        PartnershipStatus = p_PartnershipStatus
    WHERE Id = p_Id AND IsDeleted = 0;

    SELECT 0 AS RESULT;
END$$

-- Xóa Partner (chỉ đánh dấu IsDeleted = 1)
CREATE PROCEDURE DeletePartner(
    IN p_Id INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;

    UPDATE Partner
    SET IsDeleted = 1
    WHERE Id = p_Id;

    SELECT 0 AS RESULT;
END$$

DELIMITER ;
DELIMITER $$

CREATE PROCEDURE GetCustomerByPageOrder(
    IN p_PageIndex INT,         -- Trang hiện tại
    IN p_PageSize INT,          -- Số dòng trên mỗi trang
    IN p_OrderType VARCHAR(4),  -- 'ASC' hoặc 'DESC'
    IN p_CustomerName VARCHAR(255),
    IN p_PhoneNumber VARCHAR(10),
    IN p_CustomerStatut NVARCHAR(20)  -- Thêm tham số tìm theo trạng thái khách hàng
)
BEGIN
    DECLARE v_Offset INT;
    DECLARE v_FilterCondition VARCHAR(1000);
    
    SET v_Offset = (p_PageIndex - 1) * p_PageSize;
    SET v_FilterCondition = ' WHERE IsDeleted = 0 ';  -- Chỉ lấy khách hàng chưa bị xóa

    -- Xây dựng điều kiện WHERE dựa trên giá trị đầu vào
    IF p_CustomerName IS NOT NULL AND p_CustomerName <> '' THEN
        SET v_FilterCondition = CONCAT(v_FilterCondition, " AND CustomerName LIKE '%", p_CustomerName, "%' ");
    END IF;
    
    IF p_PhoneNumber IS NOT NULL AND p_PhoneNumber <> '' THEN
        SET v_FilterCondition = CONCAT(v_FilterCondition, " AND PhoneNumber LIKE '%", p_PhoneNumber, "%' ");
    END IF;
    
    IF p_CustomerStatut IS NOT NULL AND p_CustomerStatut <> '' THEN
        SET v_FilterCondition = CONCAT(v_FilterCondition, " AND CustomerStatut LIKE '%", p_CustomerStatut, "%' ");
    END IF;

    -- Lấy tổng số bản ghi phù hợp với điều kiện
    SET @sql_count = CONCAT(
        'SELECT COUNT(*) INTO @TotalRecords FROM Customer ', v_FilterCondition
    );
    PREPARE stmt_count FROM @sql_count;
    EXECUTE stmt_count;
    DEALLOCATE PREPARE stmt_count;

    -- Lấy danh sách khách hàng với phân trang
    SET @sql = CONCAT(
        'SELECT *, @TotalRecords AS TotalRecords FROM Customer ',
        v_FilterCondition,
        ' ORDER BY CustomerName ', p_OrderType,
        ' LIMIT ', p_PageSize, ' OFFSET ', v_Offset
    );

    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END$$

DELIMITER ;


DELIMITER $$

-- Thêm mới customer
CREATE PROCEDURE AddCustomer(
    IN p_CustomerName NVARCHAR(50),
    IN p_PhoneNumber VARCHAR(10),
    IN p_Email NVARCHAR(50),
    IN p_Address NVARCHAR(100),
	IN p_statust  VARCHAR(20)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;

    INSERT INTO Customer (CustomerName, PhoneNumber, Email, Address,CustomerStatut)
    VALUES (p_CustomerName, p_PhoneNumber, p_Email, p_Address,p_statust);

    SELECT 0 AS RESULT;
END$$

-- Cập nhật Partner
CREATE PROCEDURE UpdateCustomer(
    IN p_Id INT,
    IN p_CustomerName NVARCHAR(50),
    IN p_PhoneNumber VARCHAR(10),
    IN p_Email NVARCHAR(50),
    IN p_Address NVARCHAR(100),
	IN p_statust  VARCHAR(20)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;

    UPDATE Customer
    SET 
        CustomerName = p_CustomerName,
        PhoneNumber = p_PhoneNumber,
        Email = p_Email,
        Address = p_Address,
        CustomerStatut=p_statust
    WHERE Id = p_Id AND IsDeleted = 0;

    SELECT 0 AS RESULT;
END$$


CREATE PROCEDURE DeleteCustomer(
    IN p_Id INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;

    UPDATE Customer
    SET IsDeleted = 1
    WHERE Id = p_Id;

    SELECT 0 AS RESULT;
END$$

DELIMITER ;



-- PROJECT

 

DELIMITER $$

CREATE PROCEDURE AddProject(
    IN p_ProjectName NVARCHAR(50),
    IN p_DepartmentId INT,
    IN p_PartnerId INT,
    IN p_Description TEXT,
    IN p_ProjectStartDate DATE,
    IN p_ProjectEndDate DATE,
    IN p_ProjectStatus NVARCHAR(50),
    IN p_CustomerId INT
)
BEGIN
    DECLARE v_NewProjectId INT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT -1 AS NewProjectId; -- Nếu lỗi, trả về -1
    END;

    INSERT INTO Project (ProjectName, DepartmentId, PartnerId, Description, ProjectStartDate, ProjectEndDate, ProjectStatus,CustomerId)
    VALUES (p_ProjectName, p_DepartmentId, p_PartnerId, p_Description, p_ProjectStartDate, p_ProjectEndDate, p_ProjectStatus,p_CustomerId);
    
    SET v_NewProjectId = LAST_INSERT_ID(); -- Lấy ID vừa thêm

    SELECT v_NewProjectId AS NewId; -- Trả về ID
END$$

DELIMITER ;


DELIMITER $$
-- Cập nhật dự án
CREATE PROCEDURE UpdateProject(
    IN p_Id INT,
    IN p_ProjectName NVARCHAR(50),
    IN p_DepartmentId INT,
    IN p_PartnerId INT,
    IN p_Description TEXT,
    IN p_ProjectStartDate DATE,
    IN p_ProjectEndDate DATE,
    IN p_ProjectStatus NVARCHAR(50),
    IN p_CustomerId INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;

    UPDATE Project
    SET ProjectName = p_ProjectName,
        DepartmentId = p_DepartmentId,
        PartnerId = p_PartnerId,
        Description = p_Description,
        ProjectStartDate = p_ProjectStartDate,
        ProjectEndDate = p_ProjectEndDate,
        ProjectStatus = p_ProjectStatus,
        CustomerId=p_CustomerId
    WHERE Id = p_Id AND IsDeleted = 0;

    SELECT 0 AS RESULT;
END$$

-- Xóa mềm dự án
CREATE PROCEDURE DeleteProject(
    IN p_Id INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;

    UPDATE Project
    SET IsDeleted = 1
    WHERE Id = p_Id;

    SELECT 0 AS RESULT;
END$$

-- Lấy danh sách dự án với phân trang & sắp xếp
CREATE PROCEDURE GetProjectByPageOrder(
    IN p_PageIndex INT,
    IN p_PageSize INT,
    IN p_OrderType VARCHAR(4),
    IN p_ProjectName VARCHAR(255)
)
BEGIN
    DECLARE v_Offset INT;
    SET v_Offset = (p_PageIndex - 1) * p_PageSize;

    SELECT 
        p.Id,
        p.ProjectName,
        p.DepartmentId,
        d.DepartmentName,
        cs.CustomerName,
        p.PartnerId,
        pr.PartnerName,
        p.Description,
        p.ProjectStartDate,
        p.ProjectEndDate,
        p.ProjectStatus,
        COUNT(*) OVER () AS TotalRecords
    FROM Project p
    LEFT JOIN Department d ON p.DepartmentId = d.Id
    LEFT JOIN Partner pr ON p.PartnerId = pr.Id
    LEFT JOIN Customer cs ON p.CustomerId=cs.Id
    WHERE p.IsDeleted = 0
        AND (p_ProjectName IS NULL OR p_ProjectName = '' OR p.ProjectName LIKE CONCAT('%', p_ProjectName, '%'))
    ORDER BY 
        CASE WHEN p_OrderType = 'ASC' THEN p.ProjectName END ASC,
        CASE WHEN p_OrderType = 'DESC' THEN p.ProjectName END DESC
    LIMIT p_PageSize OFFSET v_Offset;
END$$

DELIMITER ;
 

-- Document
DELIMITER $$

-- Thêm mới tài liệu
CREATE PROCEDURE AddDocument(
    IN p_DocumentName NVARCHAR(50),
    IN p_DocumentLink TEXT,
    IN p_RelatedId INT,
    IN p_RelatedType NVARCHAR(50)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;

    INSERT INTO Document (DocumentName, DocumentLink, RelatedId, RelatedType)
    VALUES (p_DocumentName, p_DocumentLink, p_RelatedId, p_RelatedType);

    SELECT 0 AS RESULT;
END$$

-- Cập nhật tài liệu
CREATE PROCEDURE UpdateDocument(
    IN p_Id INT,
    IN p_DocumentName NVARCHAR(50),
    IN p_DocumentLink TEXT,
    IN p_RelatedId INT,
    IN p_RelatedType NVARCHAR(50)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;

    UPDATE Document
    SET DocumentName = p_DocumentName,
        DocumentLink = p_DocumentLink,
        RelatedId = p_RelatedId,
        RelatedType = p_RelatedType
    WHERE Id = p_Id AND IsDeleted = 0;

    SELECT 0 AS RESULT;
END$$

-- Xóa mềm tài liệu
CREATE PROCEDURE DeleteDocument(
    IN p_Id INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;

    UPDATE Document
    SET IsDeleted = 1
    WHERE Id = p_Id;

    SELECT 0 AS RESULT;
END$$

-- Lấy danh sách tài liệu có phân trang & sắp xếp
CREATE PROCEDURE GetDocumentByPageOrder(
    IN p_PageIndex INT,
    IN p_PageSize INT,
    IN p_OrderType VARCHAR(4),
    IN p_DocumentName VARCHAR(255),
    IN p_RelatedType NVARCHAR(50)
)
BEGIN
    DECLARE v_Offset INT;
    SET v_Offset = (p_PageIndex - 1) * p_PageSize;

    SELECT 
        d.Id AS DocumentId,
        d.DocumentName,
        d.DocumentLink,
        d.RelatedId,
        d.RelatedType,
        COUNT(*) OVER () AS TotalRecords
    FROM Document d
    WHERE d.IsDeleted = 0
        AND (p_DocumentName IS NULL OR p_DocumentName = '' OR d.DocumentName LIKE CONCAT('%', p_DocumentName, '%'))
        AND (p_RelatedType IS NULL OR p_RelatedType = '' OR d.RelatedType = p_RelatedType)
    ORDER BY 
        CASE WHEN p_OrderType = 'ASC' THEN d.DocumentName END ASC,
        CASE WHEN p_OrderType = 'DESC' THEN d.DocumentName END DESC
    LIMIT p_PageSize OFFSET v_Offset;
END$$

DELIMITER ;


-- services:
DELIMITER $$

-- Thêm Service
CREATE PROCEDURE AddService(
    IN p_ServiceName NVARCHAR(100),
    IN p_Description TEXT,
    IN p_ServiceStatus NVARCHAR(50)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;
    
    INSERT INTO `Service` (ServiceName, Description, ServiceStatus) 
    VALUES (p_ServiceName, p_Description, p_ServiceStatus);
    
    SELECT 0 AS RESULT;
END$$

-- Cập nhật Service
CREATE PROCEDURE UpdateService(
    IN p_Id INT,
    IN p_ServiceName NVARCHAR(100),
    IN p_Description TEXT,
    IN p_ServiceStatus NVARCHAR(50)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;
    
    UPDATE `Service`
    SET ServiceName = p_ServiceName,
        Description = p_Description,
        ServiceStatus = p_ServiceStatus,
        updated_at = CURRENT_TIMESTAMP
    WHERE Id = p_Id AND IsDeleted = 0;
    
    SELECT 0 AS RESULT;
END$$

-- Xóa mềm Service
CREATE PROCEDURE DeleteService(
    IN p_Id INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;
    
    UPDATE `Service`
    SET IsDeleted = 1, updated_at = CURRENT_TIMESTAMP
    WHERE Id = p_Id;
    
    SELECT 0 AS RESULT;
END$$

-- Lấy danh sách Service
CREATE PROCEDURE GetServicesByPageOrder(
    IN p_PageIndex INT,         -- Trang hiện tại
    IN p_PageSize INT,          -- Số dòng trên mỗi trang
    IN p_OrderType VARCHAR(4),  -- 'ASC' hoặc 'DESC'
    IN p_ServiceName VARCHAR(255)  -- Tên dịch vụ cần tìm (có thể NULL)
)
BEGIN
    DECLARE v_Offset INT;
    DECLARE v_ServiceFilter VARCHAR(400);
    SET v_Offset = (p_PageIndex - 1) * p_PageSize;

    -- Xử lý điều kiện tìm kiếm
    IF p_ServiceName IS NOT NULL AND p_ServiceName != '' THEN
        SET v_ServiceFilter = CONCAT(" AND ServiceName LIKE '%", p_ServiceName, "%' ");
    ELSE
        SET v_ServiceFilter = "";
    END IF;

    -- Xây dựng SQL lấy danh sách dịch vụ kèm tổng số bản ghi
    SET @sql = CONCAT(
        'SELECT *, COUNT(*) OVER () AS TotalRecords FROM Service WHERE isdeleted=0',
        v_ServiceFilter,
        ' ORDER BY ServiceName ', p_OrderType,
        ' LIMIT ', p_PageSize, ' OFFSET ', v_Offset
    );

    -- Thực thi SQL động
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END$$

DELIMITER ;


-- PRODUCT

DELIMITER $$

-- Thêm Product
CREATE PROCEDURE AddProduct(
    IN p_ProductName NVARCHAR(50),
    IN p_DepartmentId INT,
    IN p_ProductStartDate DATE,
    IN p_ProductEndDate DATE,
    IN p_ProductStatus NVARCHAR(50)
)
BEGIN
    DECLARE v_NewProductId INT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT -1 AS NewProductId; -- Nếu lỗi, trả về -1
    END;

    INSERT INTO Product (ProductName, DepartmentId, ProductStartDate, ProductEndDate, ProductStatus)
    VALUES (p_ProductName, p_DepartmentId, p_ProductStartDate, p_ProductEndDate, p_ProductStatus);

    SET v_NewProductId = LAST_INSERT_ID(); -- Lấy ID vừa thêm

    SELECT v_NewProductId AS NewId; -- Trả về ID mới
END$$

DELIMITER ;
DELIMITER $$

-- Cập nhật Product
CREATE PROCEDURE UpdateProduct(
    IN p_Id INT,
    IN p_ProductName NVARCHAR(50),
    IN p_DepartmentId INT,
    IN p_ProductStartDate DATE,
    IN p_ProductEndDate DATE,
    IN p_ProductStatus NVARCHAR(50)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;
    
    UPDATE Product
    SET ProductName = p_ProductName,
        DepartmentId = p_DepartmentId,
        ProductStartDate = p_ProductStartDate,
        ProductEndDate = p_ProductEndDate,
        ProductStatus = p_ProductStatus
    WHERE Id = p_Id AND IsDeleted = 0;
    
    SELECT 0 AS RESULT;
END$$

-- Xóa mềm Product
CREATE PROCEDURE DeleteProduct(
    IN p_Id INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;
    
    UPDATE Product
    SET IsDeleted = 1
    WHERE Id = p_Id;
    
    SELECT 0 AS RESULT;
END$$

-- Lấy danh sách Product có phân trang và sắp xếp
CREATE PROCEDURE GetProductsByPageOrder(
    IN p_PageIndex INT,
    IN p_PageSize INT,
    IN p_OrderType VARCHAR(4),
    IN p_ProductName VARCHAR(255)
)
BEGIN
    DECLARE v_Offset INT;
    DECLARE v_ProductFilter VARCHAR(400);
    SET v_Offset = (p_PageIndex - 1) * p_PageSize;

    -- Xử lý điều kiện tìm kiếm
    IF p_ProductName IS NOT NULL AND p_ProductName != '' THEN
        SET v_ProductFilter = CONCAT(" AND p.ProductName LIKE '%", p_ProductName, "%' ");
    ELSE
        SET v_ProductFilter = "";
    END IF;

    -- Xây dựng SQL lấy danh sách sản phẩm kèm tổng số bản ghi
    SET @sql = CONCAT(
        'SELECT p.*, d.DepartmentName, COUNT(*) OVER () AS TotalRecords 
         FROM Product p 
         JOIN Department d ON p.DepartmentId = d.Id 
         WHERE p.IsDeleted=0',
        v_ProductFilter,
        ' ORDER BY p.ProductName ', p_OrderType,
        ' LIMIT ', p_PageSize, ' OFFSET ', v_Offset
    );

    -- Debug câu SQL (nếu cần kiểm tra)
    -- SELECT @sql;

    -- Thực thi SQL động
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE GetDocuments_by_IdRelated(IN ID INT,IN Related_Type NVARCHAR(50))
BEGIN 
    SELECT * FROM document WHERE RelatedId = ID AND RelatedType=Related_Type  AND IsDeleted = 0;
END $$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE GetPersonnelByPageOrder(
    IN p_PageIndex INT,
    IN p_PageSize INT,
    IN p_OrderType VARCHAR(4),
    IN p_PersonnelName VARCHAR(255),
    IN p_DivisionId INT,
    IN p_PositionId INT,  -- Tìm theo Chức vụ
    IN p_WorkStatus NVARCHAR(50)  -- Tìm theo Trạng thái công việc
)
BEGIN
    DECLARE v_Offset INT;
    DECLARE v_NameFilter VARCHAR(400);
    DECLARE v_DivisionFilter VARCHAR(400);
    DECLARE v_PositionFilter VARCHAR(400);
    DECLARE v_StatusFilter VARCHAR(400);

    SET v_Offset = (p_PageIndex - 1) * p_PageSize;

    -- Lọc theo tên nhân sự
    IF p_PersonnelName IS NOT NULL AND p_PersonnelName != '' THEN
        SET v_NameFilter = CONCAT(" AND p.PersonnelName LIKE '%", p_PersonnelName, "%' ");
    ELSE
        SET v_NameFilter = "";
    END IF;

    -- Lọc theo DivisionId
    IF p_DivisionId IS NOT NULL AND p_DivisionId > 0 THEN
        SET v_DivisionFilter = CONCAT(" AND p.DivisionId = ", p_DivisionId);
    ELSE
        SET v_DivisionFilter = "";
    END IF;

    -- Lọc theo PositionId
    IF p_PositionId IS NOT NULL AND p_PositionId > 0 THEN
        SET v_PositionFilter = CONCAT(" AND p.PositionId = ", p_PositionId);
    ELSE
        SET v_PositionFilter = "";
    END IF;

    -- Lọc theo WorkStatus
    IF p_WorkStatus IS NOT NULL AND p_WorkStatus != '' THEN
        SET v_StatusFilter = CONCAT(" AND p.WorkStatus = '", p_WorkStatus, "' ");
    ELSE
        SET v_StatusFilter = "";
    END IF;

    -- Xây dựng SQL lấy danh sách nhân sự + tổng số bản ghi không bị ảnh hưởng bởi bộ lọc
    SET @sql = CONCAT(
        'SELECT p.Id, p.PersonnelName, p.DivisionId, p.PositionId, p.Picture, p.Description, ',
        'p.Gender, d.DivisionName, pos.PositionName, p.DateOfBirth, p.Email, p.PhoneNumber, ',
        'p.JoinDate, p.EndDate, p.WorkStatus, ',
        'COUNT(*) OVER () AS TotalRecords ',
        'FROM Personnel p ',
        'LEFT JOIN Division d ON p.DivisionId = d.Id ',
        'LEFT JOIN `Position` pos ON p.PositionId = pos.Id ',
        'WHERE p.IsDeleted = 0 ',
        v_NameFilter,
        v_DivisionFilter,
        v_PositionFilter,
        v_StatusFilter,
        ' ORDER BY p.PersonnelName ', p_OrderType, 
        ' LIMIT ', p_PageSize, ' OFFSET ', v_Offset
    );

    -- Thực thi SQL động
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END$$

DELIMITER ;



DELIMITER $$

CREATE PROCEDURE AddPersonnel(
    IN p_DivisionId INT,
    IN p_PersonnelName NVARCHAR(50),
    IN p_PositionId INT,
    IN p_DateOfBirth DATE,
    IN p_Gender NVARCHAR(10),   -- Thêm Gender vào đây
    IN p_Picture NVARCHAR(255),
    IN p_Email NVARCHAR(50),
    IN p_Description TEXT,
    IN p_PhoneNumber VARCHAR(10),
    IN p_JoinDate DATE,
    IN p_EndDate DATE,
    IN p_WorkStatus NVARCHAR(50)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;

    INSERT INTO Personnel (DivisionId, PersonnelName, PositionId, DateOfBirth, Gender, Picture, Email, Description, PhoneNumber, JoinDate, EndDate, WorkStatus)
    VALUES (p_DivisionId, p_PersonnelName, p_PositionId, p_DateOfBirth, p_Gender, p_Picture, p_Email, p_Description, p_PhoneNumber, p_JoinDate, p_EndDate, p_WorkStatus);

    SELECT 0 AS RESULT;
END$$

DELIMITER ;
DELIMITER $$

CREATE PROCEDURE UpdatePersonnel(
    IN p_Id INT,
    IN p_DivisionId INT,
    IN p_PersonnelName NVARCHAR(50),
    IN p_PositionId INT,
    IN p_DateOfBirth DATE,
    IN p_Gender NVARCHAR(10),   -- Thêm Gender vào đây
    IN p_Picture NVARCHAR(255),
    IN p_Email NVARCHAR(50),
    IN p_Description TEXT,
    IN p_PhoneNumber VARCHAR(10),
    IN p_JoinDate DATE,
    IN p_EndDate DATE,
    IN p_WorkStatus NVARCHAR(50)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;

    UPDATE Personnel
    SET DivisionId = p_DivisionId,
        PersonnelName = p_PersonnelName,
        PositionId = p_PositionId,
        DateOfBirth = p_DateOfBirth,
        Gender = p_Gender,   -- Thêm Gender vào đây
        Picture = p_Picture,
        Email = p_Email,
        Description = p_Description,
        PhoneNumber = p_PhoneNumber,
        JoinDate = p_JoinDate,
        EndDate = p_EndDate,
        WorkStatus = p_WorkStatus
    WHERE Id = p_Id AND IsDeleted = 0;

    SELECT 0 AS RESULT;
END$$

DELIMITER ;
DELIMITER $$

CREATE PROCEDURE DeletePersonnel(
    IN p_Id INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;

    UPDATE Personnel
    SET IsDeleted = 1
    WHERE Id = p_Id;

    SELECT 0 AS RESULT;
END$$

DELIMITER ;

-- IntellectualPropertyImage

DELIMITER $$

-- Thêm IntellectualProperty
CREATE PROCEDURE AddIntellectualProperty(
    IN p_DepartmentId INT,
    IN p_IntellectualPropertyName NVARCHAR(100),
    IN p_IntellectualPropertyImage TEXT,
    IN p_Description TEXT,
    IN p_IntellectualPropertyStatus NVARCHAR(50)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;
    
    INSERT INTO IntellectualProperty (DepartmentId, IntellectualPropertyName, IntellectualPropertyImage, Description, IntellectualPropertyStatus)
    VALUES (p_DepartmentId, p_IntellectualPropertyName, p_IntellectualPropertyImage, p_Description, p_IntellectualPropertyStatus);
    
    SELECT 0 AS RESULT;
END$$

-- Cập nhật IntellectualProperty
CREATE PROCEDURE UpdateIntellectualProperty(
    IN p_Id INT,
    IN p_DepartmentId INT,
    IN p_IntellectualPropertyName NVARCHAR(100),
    IN p_IntellectualPropertyImage TEXT,
    IN p_Description TEXT,
    IN p_IntellectualPropertyStatus NVARCHAR(50)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;
    
    UPDATE IntellectualProperty
    SET DepartmentId = p_DepartmentId,
        IntellectualPropertyName = p_IntellectualPropertyName,
        IntellectualPropertyImage = p_IntellectualPropertyImage,
        Description = p_Description,
        IntellectualPropertyStatus = p_IntellectualPropertyStatus,
        updated_at = CURRENT_TIMESTAMP
    WHERE Id = p_Id AND IsDeleted = 0;
    
    SELECT 0 AS RESULT;
END$$

-- Xóa mềm IntellectualProperty
CREATE PROCEDURE DeleteIntellectualProperty(
    IN p_Id INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;
    
    UPDATE IntellectualProperty
    SET IsDeleted = 1,
        updated_at = CURRENT_TIMESTAMP
    WHERE Id = p_Id;
    
    SELECT 0 AS RESULT;
END$$

-- Lấy danh sách IntellectualProperty có phân trang, sắp xếp và lấy cả tên phòng ban
CREATE PROCEDURE GetIntellectualPropertiesByPageOrder(
    IN p_PageIndex INT,        -- Trang hiện tại
    IN p_PageSize INT,         -- Số dòng trên mỗi trang
    IN p_OrderType VARCHAR(4), -- 'ASC' hoặc 'DESC'
    IN p_IntellectualPropertyName VARCHAR(255) -- Tên cần tìm (có thể NULL)
)
BEGIN
    DECLARE v_Offset INT;
    DECLARE v_Filter VARCHAR(400);
    SET v_Offset = (p_PageIndex - 1) * p_PageSize;

    -- Xử lý điều kiện tìm kiếm
    IF p_IntellectualPropertyName IS NOT NULL AND p_IntellectualPropertyName != '' THEN
        SET v_Filter = CONCAT(" AND ip.IntellectualPropertyName LIKE '%", p_IntellectualPropertyName, "%' ");
    ELSE
        SET v_Filter = "";
    END IF;

    -- Xây dựng SQL động
    SET @sql = CONCAT(
        'SELECT ip.*, d.Id AS DepartmentId, d.DepartmentName, COUNT(*) OVER () AS TotalRecords 
        FROM IntellectualProperty ip
        LEFT JOIN Department d ON ip.DepartmentId = d.Id
        WHERE ip.IsDeleted=0',
        v_Filter,
        ' ORDER BY ip.IntellectualPropertyName ', p_OrderType,
        ' LIMIT ', p_PageSize, ' OFFSET ', v_Offset
    );

    -- Thực thi SQL động
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END$$

DELIMITER ; 

-- trainging course
DELIMITER $$

-- Thêm khóa đào tạo
CREATE PROCEDURE AddTrainingCourse(
    IN p_CourseName NVARCHAR(100),
    IN p_ServiceStatus NVARCHAR(50),
    IN p_Description TEXT,
    IN p_Duration INT,
    IN p_InstructorId INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;
    
    INSERT INTO TrainingCourse (CourseName, ServiceStatus, Description, Duration, InstructorId)
    VALUES (p_CourseName, p_ServiceStatus, p_Description, p_Duration, p_InstructorId);
    
    SELECT 0 AS RESULT;
END$$

-- Cập nhật khóa đào tạo
CREATE PROCEDURE UpdateTrainingCourse(
    IN p_Id INT,
    IN p_CourseName NVARCHAR(100),
    IN p_ServiceStatus NVARCHAR(50),
    IN p_Description TEXT,
    IN p_Duration INT,
    IN p_InstructorId INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;
    
    UPDATE TrainingCourse
    SET CourseName = p_CourseName,
        ServiceStatus = p_ServiceStatus,
        Description = p_Description,
        Duration = p_Duration,
        InstructorId = p_InstructorId,
        updated_at = CURRENT_TIMESTAMP
    WHERE Id = p_Id AND IsDeleted = 0;
    
    SELECT 0 AS RESULT;
END$$

-- Xóa mềm khóa đào tạo
CREATE PROCEDURE DeleteTrainingCourse(
    IN p_Id INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;
    
    UPDATE TrainingCourse
    SET IsDeleted = 1, updated_at = CURRENT_TIMESTAMP
    WHERE Id = p_Id;
    
    SELECT 0 AS RESULT;
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE GetTrainingCoursesByPageOrder(
    IN p_PageIndex INT,         -- Trang hiện tại
    IN p_PageSize INT,          -- Số dòng trên mỗi trang
    IN p_OrderType VARCHAR(4),  -- 'ASC' hoặc 'DESC'
    IN p_CourseName VARCHAR(255),  -- Tên khóa đào tạo cần tìm (có thể NULL)
    IN p_InstructorId INT,      -- ID giảng viên (có thể NULL)
    IN p_ServiceStatus NVARCHAR(50) -- Trạng thái khóa học (có thể NULL)
)
BEGIN
    DECLARE v_Offset INT;
    DECLARE v_CourseFilter VARCHAR(400);
    DECLARE v_InstructorFilter VARCHAR(400);
    DECLARE v_StatusFilter VARCHAR(400);

    SET v_Offset = (p_PageIndex - 1) * p_PageSize;

    -- Xử lý điều kiện tìm kiếm theo CourseName
    IF p_CourseName IS NOT NULL AND p_CourseName != '' THEN
        SET v_CourseFilter = CONCAT(" AND tc.CourseName LIKE '%", p_CourseName, "%' ");
    ELSE
        SET v_CourseFilter = "";
    END IF;

    -- Xử lý điều kiện tìm kiếm theo InstructorId
    IF p_InstructorId IS NOT NULL THEN
        SET v_InstructorFilter = CONCAT(" AND tc.InstructorId = ", p_InstructorId, " ");
    ELSE
        SET v_InstructorFilter = "";
    END IF;

    -- Xử lý điều kiện tìm kiếm theo ServiceStatus
    IF p_ServiceStatus IS NOT NULL AND p_ServiceStatus != '' THEN
        SET v_StatusFilter = CONCAT(" AND tc.ServiceStatus = '", p_ServiceStatus, "' ");
    ELSE
        SET v_StatusFilter = "";
    END IF;

    -- Xây dựng SQL lấy danh sách khóa đào tạo kèm tổng số bản ghi của cả bảng (IsDeleted = 0)
    SET @sql = CONCAT(
        'SELECT tc.*, p.PersonnelName AS InstructorName, 
               COUNT(*) OVER () AS TotalRecords 
         FROM TrainingCourse tc 
         LEFT JOIN Personnel p ON tc.InstructorId = p.Id 
         WHERE tc.IsDeleted = 0',
         v_CourseFilter,
         v_InstructorFilter,
         v_StatusFilter,
         ' ORDER BY tc.CourseName ', p_OrderType,
         ' LIMIT ', p_PageSize, ' OFFSET ', v_Offset
    );

    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END$$

DELIMITER ;



-- topic

DELIMITER $$

-- Thêm Topic
CREATE PROCEDURE AddTopic(
    IN p_TopicName NVARCHAR(50),
    IN p_DepartmentId INT,
    IN p_TopicStartDate DATE,
    IN p_TopicEndDate DATE,
    IN p_Description TEXT,
    IN p_TopicStatus NVARCHAR(50),
    IN p_CustomerId INT
)
BEGIN
    DECLARE v_NewTopicId INT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT -1 AS NewTopicId;
    END;

    INSERT INTO Topic (TopicName, DepartmentId, TopicStartDate, TopicEndDate, Description, TopicStatus,CustomerId)
    VALUES (p_TopicName, p_DepartmentId, p_TopicStartDate, p_TopicEndDate, p_Description, p_TopicStatus,p_CustomerId);

    SET v_NewTopicId = LAST_INSERT_ID();

    SELECT v_NewTopicId AS NewId;
END$$

-- Cập nhật Topic
CREATE PROCEDURE UpdateTopic(
    IN p_Id INT,
    IN p_TopicName NVARCHAR(50),
    IN p_DepartmentId INT,
    IN p_TopicStartDate DATE,
    IN p_TopicEndDate DATE,
    IN p_Description TEXT,
    IN p_TopicStatus NVARCHAR(50),
    IN p_CustomerId INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;
    
    UPDATE Topic
    SET TopicName = p_TopicName,
        DepartmentId = p_DepartmentId,
        TopicStartDate = p_TopicStartDate,
        TopicEndDate = p_TopicEndDate,
        Description = p_Description,
        TopicStatus = p_TopicStatus,
        CustomerId=p_CustomerId,
        updated_at = CURRENT_TIMESTAMP
    WHERE Id = p_Id AND IsDeleted = 0;
    
    SELECT 0 AS RESULT;
END$$

-- Xóa mềm Topic
CREATE PROCEDURE DeleteTopic(
    IN p_Id INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;
    
    UPDATE Topic
    SET IsDeleted = 1, updated_at = CURRENT_TIMESTAMP
    WHERE Id = p_Id;
    
    SELECT 0 AS RESULT;
END$$


DELIMITER ;
DELIMITER $$

CREATE PROCEDURE GetTopicsByPageOrder(
    IN p_PageIndex INT,
    IN p_PageSize INT,
    IN p_OrderType VARCHAR(4),   -- 'ASC' hoặc 'DESC'
    IN p_TopicName VARCHAR(255), -- Tên chủ đề cần tìm (có thể NULL)
    IN p_DepartmentId INT,       -- Mã đơn vị cần tìm (có thể NULL)
    IN p_StatusName VARCHAR(255) -- Tên trạng thái cần tìm (có thể NULL)
)
BEGIN
    DECLARE v_Offset INT;
    DECLARE v_TopicFilter VARCHAR(400);
    DECLARE v_DepartmentFilter VARCHAR(400);
    DECLARE v_StatusFilter VARCHAR(400);
    
    SET v_Offset = (p_PageIndex - 1) * p_PageSize;

    -- Xử lý điều kiện tìm kiếm theo TopicName
    IF p_TopicName IS NOT NULL AND p_TopicName != '' THEN
        SET v_TopicFilter = CONCAT(" AND t.TopicName LIKE '%", p_TopicName, "%' ");
    ELSE
        SET v_TopicFilter = "";
    END IF;

    -- Xử lý điều kiện tìm kiếm theo DepartmentId
    IF p_DepartmentId IS NOT NULL THEN
        SET v_DepartmentFilter = CONCAT(" AND t.DepartmentId = ", p_DepartmentId, " ");
    ELSE
        SET v_DepartmentFilter = "";
    END IF;

    -- Xử lý điều kiện tìm kiếm theo StatusName
    IF p_StatusName IS NOT NULL AND p_StatusName != '' THEN
        SET v_StatusFilter = CONCAT(" AND t.TopicStatus = '", p_StatusName, "' ");
    ELSE
        SET v_StatusFilter = "";
    END IF;

    -- Xây dựng SQL lấy danh sách topic kèm tổng số bản ghi
    SET @sql = CONCAT(
        'SELECT t.*, d.DepartmentName, c.CustomerName, COUNT(*) OVER () AS TotalRecords 
         FROM Topic t 
         JOIN Department d ON t.DepartmentId = d.Id 
         LEFT JOIN Customer c ON t.CustomerId = c.Id 
         WHERE t.IsDeleted = 0',
        v_TopicFilter,
        v_DepartmentFilter,
        v_StatusFilter,
        ' ORDER BY t.TopicName ', p_OrderType,
        ' LIMIT ', p_PageSize, ' OFFSET ', v_Offset
    );

    -- Thực thi SQL động
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END$$

DELIMITER ;

-- user

DELIMITER $$

-- Thêm User
CREATE PROCEDURE AddUser(
    IN p_Email VARCHAR(255),
    IN p_Password VARCHAR(255),
    IN p_FullName VARCHAR(255),
    IN p_Role ENUM('admin', 'user')
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;
    
    INSERT INTO users (email, password, fullName, role) 
    VALUES (p_Email, p_Password, p_FullName, p_Role);
    
    SELECT 0 AS RESULT;
END$$

-- Cập nhật User
CREATE PROCEDURE UpdateUser(
    IN p_Id INT,
    IN p_Email VARCHAR(255),
    IN p_Password VARCHAR(255),
    IN p_FullName VARCHAR(255),
    IN p_Role ENUM('admin', 'user')
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;
    
    UPDATE users
    SET email = p_Email, password = p_Password, fullName = p_FullName, role = p_Role
    WHERE id = p_Id;
    
    SELECT 0 AS RESULT;
END$$

-- Xóa mềm User
CREATE PROCEDURE DeleteUser(
    IN p_Id INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;
    
    DELETE FROM users WHERE id = p_Id;
    
    SELECT 0 AS RESULT;
END$$

DELIMITER $$

CREATE PROCEDURE GetUsersByPageOrder(
    IN p_PageIndex INT,
    IN p_PageSize INT,
    IN p_OrderType VARCHAR(4),  -- 'ASC' hoặc 'DESC'
    IN p_FullName VARCHAR(255),  -- Tên người dùng cần tìm (có thể NULL)
    IN p_Role ENUM('admin', 'user')  -- Vai trò cần tìm (có thể NULL)
)
BEGIN
    DECLARE v_Offset INT;
    DECLARE v_FullNameFilter VARCHAR(400);
    DECLARE v_RoleFilter VARCHAR(400);
    
    SET v_Offset = (p_PageIndex - 1) * p_PageSize;

    -- Xử lý điều kiện tìm kiếm theo FullName
    IF p_FullName IS NOT NULL AND p_FullName != '' THEN
        SET v_FullNameFilter = CONCAT(" AND FullName LIKE '%", p_FullName, "%' ");
    ELSE
        SET v_FullNameFilter = "";
    END IF;

    -- Xử lý điều kiện tìm kiếm theo Role
    IF p_Role IS NOT NULL AND p_Role != '' THEN
        SET v_RoleFilter = CONCAT(" AND Role = '", p_Role, "' ");
    ELSE
        SET v_RoleFilter = "";
    END IF;

    -- Xây dựng SQL lấy danh sách user kèm tổng số bản ghi
    SET @sql = CONCAT(
        'SELECT *, COUNT(*) OVER () AS TotalRecords FROM users WHERE 1=1',
        v_FullNameFilter,
        v_RoleFilter,
        ' ORDER BY FullName ', p_OrderType,
        ' LIMIT ', p_PageSize, ' OFFSET ', v_Offset
    );

    -- Thực thi SQL động
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END$$

DELIMITER ;

DELIMITER $$
-- Thêm tài sản
CREATE PROCEDURE InsertAsset(
    IN p_ID NVARCHAR(100),
    IN p_AssetName NVARCHAR(100),
    IN p_AssetType NVARCHAR(100),
    IN p_DivisionId INT,
    IN P_Quantity INT,
    IN p_PersonnelId INT,
    IN p_Price FLOAT,
    IN p_StatDate DATE,
    IN p_StatusAsset NVARCHAR(50),
    IN p_Description TEXT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;
    
    INSERT INTO Asset (ID, AssetName, AssetType, DivisionId, PersonnelId,Quantity, Price, StatDate, StatusAsset, Description)
    VALUES (p_ID, p_AssetName, p_AssetType, p_DivisionId, p_PersonnelId,P_Quantity, p_Price, p_StatDate, p_StatusAsset, p_Description);
    
    SELECT 0 AS RESULT;
END$$

-- Cập nhật tài sản
CREATE PROCEDURE UpdateAsset(
    IN p_ID NVARCHAR(100),
    IN p_AssetName NVARCHAR(100),
    IN p_AssetType NVARCHAR(100),
    IN p_DivisionId INT,
    IN p_PersonnelId INT,
    IN P_Quantity INT,
    IN p_Price FLOAT,
    IN p_StatDate DATE,
    IN p_StatusAsset NVARCHAR(50),
    IN p_Description TEXT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;
    
    UPDATE Asset
    SET 
        AssetName = p_AssetName,
        AssetType = p_AssetType,
        DivisionId = p_DivisionId,
        PersonnelId = p_PersonnelId,
        Quantity=P_Quantity,
        Price = p_Price,
        StatDate = p_StatDate,
        StatusAsset = p_StatusAsset,
        Description = p_Description,
        updated_at = CURRENT_TIMESTAMP
    WHERE ID = p_ID AND IsDeleted = 0;
    
    SELECT 0 AS RESULT;
END$$

-- Xóa mềm tài sản
CREATE PROCEDURE DeleteAsset(
    IN p_ID NVARCHAR(100)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;
    
    UPDATE Asset 
    SET IsDeleted = 1, updated_at = CURRENT_TIMESTAMP 
    WHERE ID = p_ID;
    
    SELECT 0 AS RESULT;
END$$

DELIMITER ;
 
DELIMITER $$

CREATE PROCEDURE GetAssetsByPageOrder(
    IN p_PageIndex INT,
    IN p_PageSize INT,
    IN p_OrderType VARCHAR(4),
    IN p_StatusAsset NVARCHAR(50),
    IN p_DivisionId INT,
    IN p_AssetName NVARCHAR(255)  -- Thêm tham số tìm theo tên tài sản
)
BEGIN
    DECLARE v_Offset INT;
    DECLARE v_StatusFilter VARCHAR(400);
    DECLARE v_DivisionFilter VARCHAR(400);
    DECLARE v_AssetNameFilter VARCHAR(400);

    SET v_Offset = (p_PageIndex - 1) * p_PageSize;

    -- Lọc theo trạng thái tài sản
    IF p_StatusAsset IS NOT NULL AND p_StatusAsset != '' THEN
        SET v_StatusFilter = CONCAT(" AND A.StatusAsset LIKE '%", p_StatusAsset, "%' ");
    ELSE
        SET v_StatusFilter = "";
    END IF;

    -- Lọc theo đơn vị (DivisionId)
    IF p_DivisionId IS NOT NULL AND p_DivisionId > 0 THEN
        SET v_DivisionFilter = CONCAT(" AND A.DivisionId = ", p_DivisionId, " ");
    ELSE
        SET v_DivisionFilter = "";
    END IF;

    -- Lọc theo tên tài sản
    IF p_AssetName IS NOT NULL AND p_AssetName != '' THEN
        SET v_AssetNameFilter = CONCAT(" AND A.AssetName LIKE '%", p_AssetName, "%' ");
    ELSE
        SET v_AssetNameFilter = "";
    END IF;

    -- Ghép SQL động
    SET @sql = CONCAT(
        'SELECT A.*, P.PersonnelName, D.DivisionName, COUNT(*) OVER () AS TotalRecords 
        FROM Asset A
        LEFT JOIN Personnel P ON A.PersonnelId = P.Id
        LEFT JOIN Division D ON A.DivisionId = D.Id
        WHERE A.IsDeleted = 0',
        v_StatusFilter,
        v_DivisionFilter,  
        v_AssetNameFilter,  -- Thêm điều kiện lọc theo tên
        ' ORDER BY A.AssetName ', p_OrderType,
        ' LIMIT ', p_PageSize, ' OFFSET ', v_Offset
    );

    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END$$

DELIMITER ;

DELIMITER $$

-- Thêm Customer_Link
CREATE PROCEDURE AddCustomerLink(
    IN p_CustomerId INT,
    IN p_RelatedId INT,
    IN p_RelatedType NVARCHAR(50)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;

    INSERT INTO Customer_Link (CustomerId, RelatedId, RelatedType) 
    VALUES (p_CustomerId, p_RelatedId, p_RelatedType);
    
    SELECT 0 AS RESULT;
END$$

-- Xóa Customer_Link (xóa cứng, không có cột IsDeleted)
CREATE PROCEDURE DeleteCustomerLink(
    IN p_CustomerId INT,
    IN p_RelatedId INT,
    IN p_RelatedType NVARCHAR(50)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;

    DELETE FROM Customer_Link
    WHERE CustomerId = p_CustomerId AND RelatedId = p_RelatedId AND RelatedType = p_RelatedType;
    
    SELECT 0 AS RESULT;
END$$
DELIMITER ;
DELIMITER $$

CREATE PROCEDURE GetCustomerLinksByPageOrder(
    IN p_PageIndex INT,         -- Trang hiện tại
    IN p_PageSize INT,          -- Số dòng trên mỗi trang
    IN p_OrderType VARCHAR(4),  -- 'ASC' hoặc 'DESC'
    IN p_CustomerName NVARCHAR(255),  -- Tìm theo tên khách hàng (có thể NULL)
    IN p_RelatedId INT,         -- Mã đối tượng liên quan (có thể NULL)
    IN p_RelatedType NVARCHAR(50)  -- Kiểu quan hệ (có thể NULL)
)
BEGIN
    DECLARE v_Offset INT;
    DECLARE v_FilterCondition VARCHAR(500) DEFAULT ' WHERE 1=1 '; -- WHERE mặc định để tránh lỗi SQL

    SET v_Offset = (p_PageIndex - 1) * p_PageSize;

    -- Lọc theo CustomerName nếu có
    IF p_CustomerName IS NOT NULL AND p_CustomerName != '' THEN
        SET v_FilterCondition = CONCAT(v_FilterCondition, " AND C.CustomerName LIKE '%", p_CustomerName, "%' ");
    END IF;

    -- Lọc theo RelatedId nếu có
    IF p_RelatedId IS NOT NULL AND p_RelatedId > 0 THEN
        SET v_FilterCondition = CONCAT(v_FilterCondition, " AND CL.RelatedId = ", p_RelatedId);
    END IF;

    -- Lọc theo RelatedType nếu có
    IF p_RelatedType IS NOT NULL AND p_RelatedType != '' THEN
        SET v_FilterCondition = CONCAT(v_FilterCondition, " AND CL.RelatedType LIKE '%", p_RelatedType, "%' ");
    END IF;

    -- Xây dựng SQL động để lấy dữ liệu
    SET @sql = CONCAT(
        'SELECT CL.*, CL.CustomerId as Id, C.CustomerName, COUNT(*) OVER () AS TotalRecords
         FROM Customer_Link CL
         LEFT JOIN Customer C ON CL.CustomerId = C.Id',
        v_FilterCondition,
        ' ORDER BY CL.RelatedType ', p_OrderType,
        ' LIMIT ', p_PageSize, ' OFFSET ', v_Offset
    );

    -- Thực thi SQL động
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END$$

DELIMITER ;


