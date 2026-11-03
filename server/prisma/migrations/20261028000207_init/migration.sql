-- CreateTable
CREATE TABLE "Region" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "nameMg" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Crop" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "nameMg" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CropCalendar" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cropId" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,
    "sowStartMonth" INTEGER NOT NULL,
    "sowEndMonth" INTEGER NOT NULL,
    "harvestStartMonth" INTEGER NOT NULL,
    "harvestEndMonth" INTEGER NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CropCalendar_cropId_fkey" FOREIGN KEY ("cropId") REFERENCES "Crop" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CropCalendar_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Advice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "cropId" TEXT,
    "topic" TEXT NOT NULL,
    "titleMg" TEXT NOT NULL,
    "textMg" TEXT NOT NULL,
    "audioFile" TEXT,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Advice_cropId_fkey" FOREIGN KEY ("cropId") REFERENCES "Crop" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Device" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "regionId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Observation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "deviceId" TEXT NOT NULL,
    "cropId" TEXT,
    "type" TEXT NOT NULL,
    "observedOn" DATETIME NOT NULL,
    "value" REAL,
    "note" TEXT,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "Observation_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Observation_cropId_fkey" FOREIGN KEY ("cropId") REFERENCES "Crop" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WeatherCache" (
    "regionId" TEXT NOT NULL PRIMARY KEY,
    "data" TEXT NOT NULL,
    "fetchedAt" DATETIME NOT NULL,
    CONSTRAINT "WeatherCache_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Region_code_key" ON "Region"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Crop_code_key" ON "Crop"("code");

-- CreateIndex
CREATE UNIQUE INDEX "CropCalendar_cropId_regionId_key" ON "CropCalendar"("cropId", "regionId");

-- CreateIndex
CREATE UNIQUE INDEX "Advice_code_key" ON "Advice"("code");

-- CreateIndex
CREATE INDEX "Observation_deviceId_updatedAt_idx" ON "Observation"("deviceId", "updatedAt");
