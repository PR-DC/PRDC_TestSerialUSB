:: uploadSource.cmd
:: Batch file to upload source of electron app
:: Author: Milos Petrasinovic <mpetrasinovic@pr-dc.com>
:: PR-DC, Republic of Serbia
:: info@pr-dc.com
:: --- INPUTS ---
::  serverPath - path to folder on server
:: --------------------
::
:: Copyright (C) 2021 PR-DC <info@pr-dc.com>
:: 
:: This program is free software: you can redistribute it and/or modify
:: it under the terms of the GNU Lesser General Public License as 
:: published by the Free Software Foundation, either version 3 of the 
:: License, or (at your option) any later version.
::  
:: This program is distributed in the hope that it will be useful,
:: but WITHOUT ANY WARRANTY; without even the implied warranty of
:: MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
:: GNU Lesser General Public License for more details.
::  
:: You should have received a copy of the GNU Lesser General Public License
:: along with this program.  If not, see <https://www.gnu.org/licenses/>.
::
:: --------------------
@echo off
set serverPath="Z:\_PRDC\PROGRAMI\__PRDC_APPS\_Cordova\TestSerialUSB\app"

:: Execute commands
cmd /k "xcopy ..\..\app\ %serverPath% /s /r /i /z /y /exclude:..\..\app\uploadExcludeList.txt"
:: --------------------