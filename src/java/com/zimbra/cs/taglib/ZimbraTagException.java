/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2005, 2006, 2007, 2009, 2010, 2013 Zimbra, Inc.
 * 
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software Foundation,
 * version 2 of the License.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program.
 * If not, see <http://www.gnu.org/licenses/>.
 * ***** END LICENSE BLOCK *****
 */
package com.zimbra.cs.taglib;

import javax.servlet.jsp.JspTagException;

public class ZimbraTagException extends JspTagException {
	public static ZimbraTagException AUTH_FAILURE(String msg) {
		return new ZimbraTagException("missing auth: "+msg);
	}
	public static ZimbraTagException MISSING_ATTR(String msg) {
		return new ZimbraTagException("missing attribute: "+msg);
	}
	public static ZimbraTagException IO_ERROR(Throwable cause) {
		return new ZimbraTagException("io error", cause);
	}
	public static ZimbraTagException SERVICE_ERROR(Throwable cause) {
		return new ZimbraTagException("service error", cause);
	}
	
	public ZimbraTagException(String msg) {
		super(msg);
	}
	public ZimbraTagException(String msg, Throwable cause) {
		super(msg, cause);
	}
}
