/**
* Fable Settings Template Processor
*
* This class allows environment variables to come in via templated expressions, and defaults to be set.
*
*
* @author Steven Velozo <steven@velozo.com>
* @module Fable Settings
*/
const libPrecedent = require('precedent');

class FableSettingsTemplateProcessor
{
	constructor(pDependencies)
	{
        // Use a no-dependencies templating engine to parse out environment variables
		this.templateProcessor = new libPrecedent();

        // TODO: Make the environment variable wrap expression demarcation characters configurable?
		this.templateProcessor.addPattern('${', '}',
			(pTemplateValue)=>
			{
				let tmpTemplateValue = pTemplateValue.trim();

				let tmpSeparatorIndex = tmpTemplateValue.indexOf('|');

				const tmpDefaultValue = tmpSeparatorIndex >= 0 ? tmpTemplateValue.substring(tmpSeparatorIndex+1) : '';

				let tmpEnvironmentVariableName = (tmpSeparatorIndex > -1) ? tmpTemplateValue.substring(0, tmpSeparatorIndex) : tmpTemplateValue;

				if (tmpEnvironmentVariableName in process.env)
				{
					return process.env[tmpEnvironmentVariableName];
				}
				else
				{
					return tmpDefaultValue;
				}
			});
    }

    parseSetting(pString)
    {
        return this.templateProcessor.parseString(pString);
    }
}

module.exports = FableSettingsTemplateProcessor;
