:: installNodejs.cmd
:: Batch file for installing certain version of node.js
:: Author: Milos Petrasinovic <mpetrasinovic@pr-dc.com>
:: PR-DC, Republic of Serbia
:: info@pr-dc.com
:: --- INPUTS ---
::  nodejsVersion - version of nodejs
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
set nodejsVersion="16.1.0"

:: Execute commands
cmd /k "cd ../../ & nvm install %nodejsVersion%"
:: --------------------