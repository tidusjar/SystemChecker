﻿SET IDENTITY_INSERT dbo.tblSubCheckType ON

INSERT INTO dbo.tblSubCheckType
(
	ID,
	CheckTypeID,
	Name
)
VALUES
(   5, -- ID - int
	2, -- CheckTypeID - int
	'Field Greater Than' -- Name - varchar(255)
)

INSERT INTO dbo.tblSubCheckType
(
	ID,
	CheckTypeID,
	Name
)
VALUES
(   6, -- ID - int
	2, -- CheckTypeID - int
	'Field Less Than' -- Name - varchar(255)
)

SET IDENTITY_INSERT dbo.tblSubCheckType OFF

SET IDENTITY_INSERT dbo.tblSubCheckTypeOption ON

INSERT INTO dbo.tblSubCheckTypeOption
(
	ID,
	SubCheckTypeID,
	OptionTypeID,
	Label,
	DefaultValue,
	IsRequired,
	Multiple
)
VALUES
(   12,   -- ID - int
	5,   -- SubCheckTypeID - int
	2,   -- OptionTypeID - int
	'Field Name (JPath expression)',  -- Label - varchar(255)
	NULL,  -- DefaultValue - varchar(255)
	1, -- IsRequired - bit
	0 -- Multiple - bit
),
(   13,   -- ID - int
	5,   -- SubCheckTypeID - int
	3,   -- OptionTypeID - int
	'Value',  -- Label - varchar(255)
	NULL,  -- DefaultValue - varchar(255)
	0, -- IsRequired - bit
	0 -- Multiple - bit
),
(   14,   -- ID - int
	5,   -- SubCheckTypeID - int
	1,   -- OptionTypeID - int
	'Exists',  -- Label - varchar(255)
	'true',  -- DefaultValue - varchar(255)
	1, -- IsRequired - bit
	0 -- Multiple - bit
)

INSERT INTO dbo.tblSubCheckTypeOption
(
	ID,
	SubCheckTypeID,
	OptionTypeID,
	Label,
	DefaultValue,
	IsRequired,
	Multiple
)
VALUES
(   15,   -- ID - int
	6,   -- SubCheckTypeID - int
	2,   -- OptionTypeID - int
	'Field Name (JPath expression)',  -- Label - varchar(255)
	NULL,  -- DefaultValue - varchar(255)
	1, -- IsRequired - bit
	0 -- Multiple - bit
),
(   16,   -- ID - int
	6,   -- SubCheckTypeID - int
	3,   -- OptionTypeID - int
	'Value',  -- Label - varchar(255)
	NULL,  -- DefaultValue - varchar(255)
	0, -- IsRequired - bit
	0 -- Multiple - bit
),
(   17,   -- ID - int
	6,   -- SubCheckTypeID - int
	1,   -- OptionTypeID - int
	'Exists',  -- Label - varchar(255)
	'true',  -- DefaultValue - varchar(255)
	1, -- IsRequired - bit
	0 -- Multiple - bit
)
SET IDENTITY_INSERT dbo.tblSubCheckTypeOption OFF