/*
 * Copyright (C) <2015-present>  <it-novum GmbH>
 *
 * This file is dual licensed
 *
 * 1.
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, version 3 of the License.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * 2.
 *     If you purchased an openITCOCKPIT Enterprise Edition you can use this file
 *     under the terms of the openITCOCKPIT Enterprise Edition license agreement.
 *     License agreement and license key will be shipped with the order
 *     confirmation.
 */

export enum SlasReportFormatEnum {
    REPORT_FORMAT_CSV = 1 << 0,                 // 1
    REPORT_FORMAT_PDF = 1 << 1,              // 2
    REPORT_FORMAT_ZIP = 1 << 2,
}

export enum SlasGenerateTabs {
    ReportConfig = 'reportConfig',
    ShowReport = 'showReport',
}

export enum SlasGenerateReportFormatEnum {
    REPORT_FORMAT_CSV = 'zip',
    REPORT_FORMAT_PDF = 'pdf',
    REPORT_FORMAT_HTML = 'html',
}
