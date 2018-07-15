import React from 'react'
import {
	ScrollView,
	View,
	ListView,
	Text,
} from 'react-native'

import { Actions as NavigationActions } from 'react-native-router-flux'
import { connect } from 'react-redux'

import ss from '../../../styles'

import SettingsMenuItem from '../../components/settings/settings-menu-item'

const SettingsMenuScreen = ({
	navigateToSettingsLegalContent,
}) =>
	(<View style={styles.wrapper}>
		<ScrollView
			contentContainerStyle={styles.viewMenu}
			showsVerticalScrollIndicator={false}
			directionalLockEnabled
		>
			<SettingsMenuItem text="Terms and Conditions" onPress={() =>
				navigateToSettingsLegalContent(terms)}
			/>
			<View style={styles.divider} />
			<SettingsMenuItem text="Privacy Policy" onPress={() =>
				navigateToSettingsLegalContent(privacy)}
			/>
			<View style={styles.divider} />
		</ScrollView>
	</View>)


// StyleSheet
const {
	size,
	base: { wrapper },
	typo: { h2, p },
} = ss

const styles = ss.create({
	wrapper: {
		...wrapper,
	},
	viewMenu: {
		paddingBottom: size(20),
	},
	divider: {
		height: 0,
		borderColor: 'rgba(0, 0, 0, 0.1)',
		borderBottomWidth: 1,
	},
})

const h2Legal = {
	...h2,
	marginBottom: size(10),
}

const pLegal = {
	...p,
	marginBottom: size(10),
}

const listView = {
	marginBottom: size(10),
}

const unorderedListItem = {
	flexDirection: 'row',
	paddingHorizontal: size(5),
}

const unorderedListText = {
	...p,
	fontSize: size(14),
}

function sectionBreak() {
	return <View style={{ height: size(15) }} />
}

function renderList(items, rowData) {
	const dataSource =
		new ListView.DataSource({
			rowHasChanged: (row1, row2) => row1 !== row2,
		}).cloneWithRows(items)
	const dataLength = dataSource.getSectionLengths()

	return (
		<ListView
			style={listView}
			dataSource={dataSource}
			renderRow={(rowData, sectionID, rowID) => rowData.title
						? (
							<View >
								<Text style={h2Legal}>{parseInt(rowID, 10) + 1}. {rowData.title}</Text>
								{rowData.text}
								{sectionBreak()}
							</View>
						)
						: (
							<View style={[unorderedListItem, { marginBottom: parseInt(rowID, 10) < dataLength - 1 ? size(5) : 0 }]}>
								<Text style={[unorderedListText, { marginRight: size(5) }]}>{'\u2022'}</Text>
								<Text style={[unorderedListText, { marginRight: size(5) }]}>{rowData}</Text>
							</View>
						)}
		/>
	)
}

const terms = {
	title: 'Terms and Conditions',
	info:
	<View>
		<Text style={h2Legal}>
			Introduction
		</Text>
		<Text style={pLegal}>
			For the purpose of these terms and conditions the following words will have the following meanings:
		</Text>
		<Text style={pLegal}>
			“We”, “us” “our” meaning DEPub Limited registered in England with company number 08969479. Registered address: Turnberry House, 1404-1410 High Road, London, N20 9BH.
		</Text>
		<Text style={pLegal}>
			“You”, “your” meaning the person or entity registering to use our services including, learners, employers and training providers.
		</Text>
		<Text style={pLegal}>
			"Website" meaning our website at www.depub.co.uk.
		</Text>
		{sectionBreak()}

		<Text style={h2Legal}>
			Registration
		</Text>
		<Text style={pLegal}>
			Only one registration per person, employer or training provider is allowed. You must keep all your information up to date. You must use an email address that you have frequent access to, as we need to be able to contact you via email. You must ensure to keep your password confidential and not share with anyone else. Please be aware that you will be held responsible for any activity in your account whether it be on the Website or on an application. If you believe that someone may have access to or is using your account, you must inform us immediately on admin@depub.co.uk or by calling us on 0333 222 4469.
		</Text>
		<Text style={pLegal}>
			You must not:
		</Text>
		{renderList([
			'Impersonate, or attempt to impersonate someone else;',
			'Allow anyone else to use your account; or',
			'Use anyone else’s account.',
		])}
		{sectionBreak()}

		<Text style={h2Legal}>
			Provision of information
		</Text>
		<Text style={pLegal}>
			You acknowledge that in order to use DEPub’s services you may be required to provide personal information to us.
		</Text>
		<Text style={pLegal}>
			By submitting an application form and purchasing a licence, you give consent to DEPub Limited to obtain, keep, use and produce information relating to your registration in line with the requirements of the Data Protection Act 1998. You agree that you understand that you have registered and this application form will become part of your profile.
		</Text>
		<Text style={pLegal}>
			You certify the information provided is correct to the best of your knowledge and all entries on the application form are correct and complete.
		</Text>
		<Text style={pLegal}>
			Please note that we will only use personal information you send us for the purposes for which you provide it. We will only hold your information for as long as necessary for these purposes and will not pass it on to any other parties, except where required to carry out our duties and functions as an e-learning provider. All employees and subsidiaries that may have access to your personal data are obliged to respect the confidentiality of your personal data. All your communications to us are protected against unauthorised access by third parties. We do not store credit card details nor do we share customer details with any third party.
		</Text>
		{sectionBreak()}

		<Text style={h2Legal}>
			Your personal information
		</Text>
		<Text style={pLegal}>
			As stated above, we will only use your personal information in accordance with our Internet Privacy Policy, which forms part of these terms and conditions. Please click here to read the Privacy Policy.
		</Text>

		<Text style={h2Legal}>
			Using our sites and applications
		</Text>
		<Text style={pLegal}>
			You may view, listen to and interact with the Website and applications for educational purposes. You may occasionally print individual pages on the site or the applications for educational purposes given that such printing is not substantial or methodical and that our trademarks and copyright are not removed.
		</Text>
		<Text style={pLegal}>
			You must not, whether directly or indirectly, copy, download, store, make available, distribute, sell or offer to sell all or any part of the content, files or data on our websites and applications to make or populate a database or publication of any kind without our written consent.
		</Text>
		<Text style={pLegal}>
			You must not use all or any part of our Website and applications for commercial purposes without our prior written consent.
		</Text>
		<Text style={pLegal}>
			Users, whether registered or not, must not abuse the Website or application by uploading false or malicious information.
		</Text>
		{sectionBreak()}

		<Text style={h2Legal}>
			Acceptable use
		</Text>
		<Text style={pLegal}>
			You agree to use DEPub’s services solely for lawful purposes. You acknowledge and agree that you will be held responsible for any communications and content shared or transmitted by you using DEPub’s services. You further acknowledge and agree that you hold all intellectual rights of the content and communications, transmitted, published or shared or that you have obtained permission from the third party that holds the intellectual property rights to share or transmit it using DEPub’s services.
		</Text>
		<Text style={pLegal}>
			You agree not to use DEPub’s services for any of the following:
		</Text>
		{renderList([
			'Send mass mailings or spam;',
			'Collect or store information about other users;',
			'Threaten or harass any fellow users;',
			'Infringe on another user’s or third party’s intellectual rights;',
			'Share or transmit any material or encourage to share or transmit any material that is obscene, unlawful, defamatory, hateful, racist, illegal or encourages criminal behaviour;',
			'Share or transmit any content which may include viruses or other harmful or destructive material;',
			'Hack or gain unauthorised access to any DEPub’s server, network or hardware;',
			'Use DEPub’s services in any way that could overload, damage, disrupt or harm the system;',
			'Adapt or modify any of our systems;',
			'Register user accounts using automated processes;',
			'Reformat, resell or redistribute DEPub’s services or systems without the prior written consent.',
		])}
		<Text style={pLegal}>
			You acknowledge that DEPub reserves the right to suspend or terminate your account at any time in order to ensure fair use.
		</Text>
		{sectionBreak()}

		<Text style={h2Legal}>
			Suspending or terminating your account
		</Text>
		<Text style={pLegal}>
			DEPub Limited reserves the right to suspend or terminate your account at any time. The main reason for suspending or terminating your account would be due to breaching these terms or conditions. If you would like to terminate your account, please contact us by calling 0333 222 44 69 or email admin@depub.co.uk.
		</Text>
		{sectionBreak()}

		<Text style={h2Legal}>
			Maintenance of the system
		</Text>
		<Text style={pLegal}>
			In order to make the use of the Website and the applications as enjoyable as possible, we may need to make changes to the system which may cause slight disruption to the services from time to time. We always endeavour to make these changes and maintenance work at times which would be least disrupting for all and we will ensure to inform all members of any major maintenance work which could cause the system to be offline for some time.
		</Text>
		<Text style={pLegal}>
			You acknowledge and agree that the maintenance is necessary and that we are not liable for any inconvenience caused due to the maintenance work.
		</Text>
		{sectionBreak()}
	</View>,
}

const privacy = {
	title: 'Privacy Policy',
	info:
	<View>
		{renderList([
			{
				title: 'Introduction and Policy Statement',
				text:
	<View>
		<Text style={pLegal}>
			DEPub Limited (the “Company”) is committed to respecting, safeguarding and preserving the privacy of all visitors to the Company’s website at www.depub.co.uk (the "Website"). This Internet Privacy Policy (the “Policy”) explains what information is being collected from users of the Website and how this information is being stored and used.
		</Text>
		<Text style={pLegal}>
			Please read the Policy carefully to understand the Company’s practices regarding your personal information and how it is treated. The Policy is regularly evaluated and updated and any changes are posted on this page. Therefore, the Company asks that all visitors to the Website review the Policy frequently.
		</Text>
		<Text style={pLegal}>
			For the purposes of the Data Protection Act 1998, the data controller is the Company (Registered Number: 08969479) whose registered office is at Turnberry House, 1404-1410 High Road, Whetstone, London N20 9BH, England. Any questions, comments or requests regarding the Policy are welcome and should be sent to the Company at admin@depub.co.uk.
		</Text>
	</View>,
			},
			{
				title: 'Data Collected',
				text:
	<View>
		<Text style={pLegal}>
			It is necessary for the Company to collect certain personal data about users of the Website (“Personal Data”) in order to operate the Website and fulfill its legitimate business purpose. This may include information collected from ordinary Internet browsers and from current, past or prospective members of DEPub services.
		</Text>
		<Text style={pLegal}>
			The Personal Data that the Company collects, stores and uses typically falls into one of the following three (3) categories:
		</Text>
		{renderList([
			'Information you give to the Company: you may give us information by filling in forms on the Website, corresponding with us (by phone, e-mail or otherwise), when you register as a member of DEPub Limited or subscribe to any of our services, by searching or placing an order on the Website, when you participate in any competition, promotion or survey, or if you report any problem with the Website. The Personal Data that you give the Company may include (without limitation) your name, address, e-mail address and phone number, financial and credit card information, personal description and photograph.',

			'Information the Company collects about you: during your visits to the Website, we may automatically collect technical information including (without limitation) the Internet protocol (IP) address used to connect your computer to the Internet, your login information, browser type and version, browser plug-in types and versions, operating system and platform. The Company may also collect information about each visit, including the products you viewed or searched for, page response times, download errors, the length of visits to certain pages, page interaction information, methods used to browse away from the page and any phone number you use to call us.',

			'Information the Company receives from other sources: we may receive or collect information about you if you use any of the other websites or services that the Company operates or provides. We may also work with third parties (e.g. business partners, sub-contractors in technical, payment and delivery services, advertising networks, analytics and search information providers or credit reference agencies) and receive] information about you from them.',
		])}
	</View>,
			},
			{
				title: 'Use of Personal Data',
				text:
	<View>
		<Text style={pLegal}>
			The Company may use Personal Data, together with any other information, for administration, marketing, customer service, education and Mobile Portfolio related activities
		</Text>
		<Text style={pLegal}>
			We will also share member information (including Personal Data) with our partner companies and training providers upon any request to undertake further studies by the relevant member. An additional Data Protection Policy will be issued subsequently.
		</Text>
		<Text style={pLegal}>
			The main ways in which Personal Data is being used by the Company are for:
		</Text>
		{renderList([
			'Updating member records;',
			'Allowing members to participate in interactive features of our website, when they choose to do so;',
			'Compiling information about how members are using the Company’s Website to identify areas of interest to them;',
			'Compiling information about how individuals are using the website, in order to improve the site, it’s functionality and its ability to meet individual’s needs (including ensuring that content is presented in the most effective way);',
			'Handling membership queries, delivering products and services, processing payments, communicating with individuals about their orders, products and services and maintaining member accounts;',
			'Advising members of other products and services which may be of interest to them or of changes to our products, services or the Website itself;',
			'Inviting individuals to participate in market research;',
			'Providing members with information about member benefits such as vouchers;',
			'Measuring and understanding the effectiveness of any advertising on the Website from time to time (and delivering that advertising);',
			'Administering the Website, for relevant internal operations (e.g. troubleshooting, data analysis, testing, statistical/research purposes) and as part of the Company’s efforts to keep the Website safe and secure.',
		])}
	</View>,
			},
			{
				title: 'Consent',
				text:
	<View>
		<Text style={pLegal}>
			By using the Company’s Website, all individuals provide consent for their Personal Data to be collected, processed and stored by the Company, and (where relevant) its partners, in the manner and for the purposes outlined in this Policy.
		</Text>
	</View>,
			},
		])}
	</View>,
}

const mapDispatchToProps = () => ({
	navigateToSettingsLegalContent: (data) => {
		NavigationActions.SettingsLegalContent(data)
	},
})

export default connect(null, mapDispatchToProps)(SettingsMenuScreen)
