/** TabNav widget embed — single source of truth for regression tests and UI. */

export const TABNAV_WIDGET_SCRIPT_SRC =
  'https://widget.tabnav.com/limited-widget.min.js.gz?req=vMQ3cmfKZ1uArD5iCVzxM4hwFZqBEeFP6tyaF6RyYkR__T6-d0cc';

export const tabNavWidgetConfig = {
  language: 'en-AU',
  color: '#330066',
  buttonColor: '#330066',
  buttonSize: 'small',
  widgetSize: 'small',
  widgetLocation: 'right',
  buttonLocation: 'bottom',
} as const;

export const TABNAV_WIDGET_CONFIG_JSON = JSON.stringify(tabNavWidgetConfig);
