module('standard');

testConverters('Valid base', ['extStandard'], function (converter) {
	strictEqual(converter.valid(2, '1'), true, '2');
	strictEqual(converter.valid(' 6', '1'), false, 'preceding space');
	strictEqual(converter.valid('36', '1'), true, '36');
	strictEqual(converter.valid(10, '1'), true, '10');
	strictEqual(converter.valid(4.256, '1'), false, '4.256');
	strictEqual(converter.valid(-4, '1'), true, '-4');
});

testConverters('Convert between bases', ['extStandard'], function (converter) {
	var i, kv, from, to, undefined,
		conversions = [
			{ from: 10, to: 2,
				'-000005.0000': '-101',
				'-0': '0',
				'-.5': '-0.1',
				'.0625': '0.0001',
				'4.': '100',
				'' : undefined,
				'.' : undefined,
				'-.' : undefined,
				'-' : undefined,
				'A': undefined,
				'BCD': undefined,
				'0..5': undefined,
				'42.375': '10 1010.011',
				',75': '0.11'
			},
			{ from: 2, to: 36,
				'102': undefined,
				'-.0': '0',
				'-,0': '0',
				'-100100000100100100001110000010.101': '-A0B1C2.MI'
			},
			{ from: 10, to: 20,
				'0.61426': '0.C5E1C'
			},
			{ from: 20, to: 10,
				'0.C5E1C': '0.61426'
			},
			{ from: -2, to: 10,
				'10100100': '-156',
				'-10100100': '156',
				'10.1101': '-2.1875',
				' 1 0 , 1 1 0 1 ': '-2.1875'
			},
			{ from: 10, to: -10,
				'1234': '19 374',
				'-1234': '2 846',
				'1234.5': undefined,
				'-12345678901234567890': '28 466 482 902 846 648 290'
			}
		];

	function keysAndValues(obj) {
		var k = [], v = [], i;
		for (i in obj) {
			if (i === 'to' || i === 'from') {
				continue;
			}
			k.push(i);
			v.push(obj[i]);
		}
		return [k, v];
	}

	for (i = 0; i < conversions.length; i++) {
		kv = keysAndValues(conversions[i]);
		to = conversions[i].to;
		from = conversions[i].from;

		var results = kv[0].map(function (number) {
			return converter.convert(from, to, number);
		});

		deepEqual(results, kv[1], 'base '+from+' > base '+to);
	}
});

testConverters('Edge cases - rounded results accepted', ['extStandard'], function (converter) {
	var i, j, k, result, good,
		conversions = [
			{ from: 16, to: 10,
				'abcdef123456.1' : [
					'188 900 967 593 046.0625',
					'188 900 967 593 046.063',
					'188 900 967 593 046.06',
					'188 900 967 593 046.1',
					'188 900 967 593 046'
				],
				'ababababababababab' : [
					'3 166 763 406 159 644 437 419',
					'3 166 763 406 159 644 437 420',
					'3 166 763 406 159 644 437 400',
					'3 166 763 406 159 644 437 000',
					'3 166 763 406 159 644 440 000',
					'3 166 763 406 159 644 400 000',
					'3 166 763 406 159 644 000 000',
					'3 166 763 406 159 640 000 000',
					'3 166 763 406 159 600 000 000'
				],
				'500.0000000001': [
					'1 280.00000 00000 00909 49470 17729 28237 91503 90625',
					'1 280.00000 00000 00909 49470 17729 28237 91503 9063',
					'1 280.00000 00000 00909 49470 17729 28237 91503 906',
					'1 280.00000 00000 00909 49470 17729 28237 91503 91',
					'1 280.00000 00000 00909 49470 17729 28237 91503 9',
					'1 280.00000 00000 00909 49470 17729 28237 91504',
					'1 280.00000 00000 00909 49470 17729 28237 9150',
					'1 280.00000 00000 00909 49470 17729 28237 915',
					'1 280.00000 00000 00909 49470 17729 28237 92',
					'1 280.00000 00000 00909 49470 17729 28237 9',
					'1 280.00000 00000 00909 49470 17729 28238',
					'1 280.00000 00000 00909 49470 17729 2824',
					'1 280.00000 00000 00909 49470 17729 282',
					'1 280.00000 00000 00909 49470 17729 28',
					'1 280.00000 00000 00909 49470 17729 3',
					'1 280.00000 00000 00909 49470 17729',
					'1 280.00000 00000 00909 49470 1773',
					'1 280.00000 00000 00909 49470 177',
					'1 280.00000 00000 00909 49470 18',
					'1 280.00000 00000 00909 49470 2',
					'1 280.00000 00000 00909 49470',
					'1 280.00000 00000 00909 4947',
					'1 280.00000 00000 00909 495',
					'1 280.00000 00000 00909 49',
					'1 280.00000 00000 00909 5',
					'1 280.00000 00000 00909',
					'1 280.00000 00000 0091',
					'1 280.00000 00000 009',
					'1 280.00000 00000 01',
					'1 280',
				],
				'5F5E0FF.FFFFFF' : [
					'99 999 999.99999 99403 95355 22460 9375',
					'99 999 999.99999 99403 95355 22460 938',
					'99 999 999.99999 99403 95355 22460 94',
					'99 999 999.99999 99403 95355 22460 9',
					'99 999 999.99999 99403 95355 2246',
					'99 999 999.99999 99403 95355 225',
					'99 999 999.99999 99403 95355 22',
					'99 999 999.99999 99403 95355 2',
					'99 999 999.99999 99403 95355',
					'99 999 999.99999 99403 9536',
					'99 999 999.99999 99403 953',
					'99 999 999.99999 99403 95',
					'99 999 999.99999 99404',
					'99 999 999.99999 994',
					'99 999 999.99999 99',
					'100 000 000'
				]
			},
			{ from: '10', to: '16',
				'65535.9999999999' : [
					'FFFF.FFFF FFFF 920C 8098 A109 1520 A546 5DF8 D2BB D972 6820 7C81 98B7 6A91 A393 DEE8 AFE1 977A A996 1B47 CA93 0D6D B9B2 61E9 3372 B9AA 0704 690B D64E B603 7828 B25B 1971 BA2E 43F3 0F7A C8FE 490C 3193 5544 C67C A851 8040 D12D 3906 217B 518F 51B2 9E4F 154E E234 69C9 5A42 0EEF E741 07D6 39E8 410D 09AA 8308 CEFF AEAB B76E E5BD 93DC B1C0 58AA 7900 6B0B 9BFD 6798 6C52 4B97 D21A F4B5 E578 C1E7 FF48 C415 CE5B 5DC2 D587 6E64 5ACA 304D 4048 C723 7D79 20A9 F8F5 3A4D 5A86 1B53 10CA DDC7 3683 F750 40FB 96E6 6B41 5D10 A8F9 F1B9 8F5A 04EC 1388 1ED2 3B11 4726 E559 FCEF ABFF 34C4 7BF2 1E27 F9BD 477E 00D2 5C04 97FD 27D7 8C22 CB77 864B 128A E295 B898 CB2E 0A56 248C C2BF AF62 40AD 685A 3BC8 9E8D F6D8 76EA 912F 9D0E 89A9 B92B C317 E652 6438 D52C C463 84A5 39E2 842C 0FA1 8A5E 253F CEA3 C6D7 0503 20D1 18D2 57FD CD32 BEBD 4148 DD84 F9FC 0F42 83AC 4928 FBBD 494D DC13 D81D 39AC 061E 4B46 59BE 7DCD B7E3 9988 75DC 8564 73EC 0CB8 5D19 AFAB 3331 F717 24EA 022D 4FF1 0E5D 815E 910F 445C 1E90 9927 CA42 8595 E97C 5410 2CDB C6B3 DAC2 C1A1 9999 F9CE A914 0CB1 A',
					'FFFF.FFFF FFFF 920C 8098 A109 1520 A546 5DF8 D2BB D972 6820 7C81 98B7 6A91 A393 DEE8 AFE1 977A A996 1B47 CA93 0D6D B9B2 61E9 3372 B9AA 0704 690B D64E B603 7828 B25B 1971 BA2E 43F3 0F7A C8FE 490C 3193 5544 C67C A851 8040 D12D 3906 217B 518F 51B2 9E4F 154E E234 69C9 5A42 0EEF E741 07D6 39E8 410D 09AA 8308 CEFF AEAB B76E E5BD 93DC B1C0 58AA 7900 6B0B 9BFD 6798 6C52 4B97 D21A F4B5 E578 C1E7 FF48 C415 CE5B 5DC2 D587 6E64 5ACA 304D 4048 C723 7D79 20A9 F8F5 3A4D 5A86 1B53 10CA DDC7 3683 F750 40FB 96E6 6B41 5D10 A8F9 F1B9 8F5A 04EC 1388 1ED2 3B11 4726 E559 FCEF ABFF 34C4 7BF2 1E27 F9BD 477E 00D2 5C04 97FD 27D7 8C22 CB77 864B 128A E295 B898 CB2E 0A56 248C C2BF AF62 40AD 685A 3BC8 9E8D F6D8 76EA 912F 9D0E 89A9 B92B C317 E652 6438 D52C C463 84A5 39E2 842C 0FA1 8A5E 253F CEA3 C6D7 0503 20D1 18D2 57FD CD32 BEBD 4148 DD84 F9FC 0F42 83AC 4928 FBBD 494D DC13 D81D 39AC 061E 4B46 59BE 7DCD B7E3 9988 75DC 8564 73EC 0CB8 5D19 AFAB 3331 F717 24EA 022D 4FF1 0E5D 815E 910F 445C 1E90 9927 CA42 8595 E97C 5410 2CDB C6B3 DAC2 C1A1 9999 F9CE A914 0CB2',
					'FFFF.FFFF FFFF 920C 8098 A109 1520 A546 5DF8 D2BB D972',
					'FFFF.FFFF FFFF 920C 8098 A109 1520 A546 5DF8 D2BB D97',
					'FFFF.FFFF FFFF 920C 8098 A109 1520 A546 5DF8 D2BB D9',
					'FFFF.FFFF FFFF 920C 8098 A109 1520 A546 5DF8 D2BB E',
					'FFFF.FFFF FFFF 920C 8098 A109 1520 A546 5DF8 D2BC',
					'FFFF.FFFF FFFF 920C 8098 A109 1520 A546 5DF8 D2C',
					'FFFF.FFFF FFFF 920C 8098 A109 1520 A546 5DF8 D3',
					'FFFF.FFFF FFFF 920C 8098 A109 1520 A546 5DF8 D',
					'FFFF.FFFF FFFF 920C 8098 A109 1520 A546 5DF9',
					'FFFF.FFFF FFFF 920C 8098 A109 1520 A546 5E',
					'FFFF.FFFF FFFF 920C 8098 A109 1520 A546 6',
					'FFFF.FFFF FFFF 920C 8098 A109 1520 A546',
					'FFFF.FFFF FFFF 920C 8098 A109 1520 A54',
					'FFFF.FFFF FFFF 920C 8098 A109 1520 A5',
					'FFFF.FFFF FFFF 920C 8098 A109 1520 A',
					'FFFF.FFFF FFFF 920C 8098 A109 1521',
					'FFFF.FFFF FFFF 920C 8098 A109 152',
					'FFFF.FFFF FFFF 920C 8098 A109 15',
					'FFFF.FFFF FFFF 920C 8098 A109 1',
					'FFFF.FFFF FFFF 920C 8098 A109',
					'FFFF.FFFF FFFF 920C 8098 A11',
					'FFFF.FFFF FFFF 920C 8098 A1',
					'FFFF.FFFF FFFF 920C 8098 A',
					'FFFF.FFFF FFFF 920C 8099',
					'FFFF.FFFF FFFF 920C 80A',
					'FFFF.FFFF FFFF 920C 8',
					'FFFF.FFFF FFFF 920D',
					'FFFF.FFFF FFFF 92',
					'FFFF.FFFF FFFF 9',
					'FFFF.FFFF FFFF',
					'1 0000'
				]
			}
		];
	function inArray(elem, arr) {
		for (var i = 0; i < arr.length; i++) {
			if (arr[i] === elem) {
				return true;
			}
		}
		return false;
	}
	for (i = 0; i < conversions.length; i++) {
		for (j in conversions[i]) {
			if (j === 'from' || j === 'to') {
				continue;
			}
			result = converter.convert(conversions[i].from, conversions[i].to, j);
			good = inArray(result, conversions[i][j]);
			equal(result, good ? result : conversions[i][j][0],
				'converting "' + j + '" (' + conversions[i].from + ' > ' + conversions[i].to + '; rounded results accepted)');
		}
	}
});

testConverters('Binary and hexadecimal prefixes', ['extStandard'], function (converter) {
	strictEqual(converter.convert('2', '10', '0b101'), '5', 'binary: 0b prefix');
	strictEqual(converter.convert('2', '10', '0B101'), '5', 'binary: 0B prefix');
	strictEqual(converter.convert('16', '10', '0x101'), '257', 'hexadecimal: 0x prefix');
	strictEqual(converter.convert('16', '10', '0X101'), '257', 'hexadecimal: 0X prefix');
	strictEqual(converter.convert('16', '10', '0b1'), '177', 'hexadecimal: 0b is not a prefix');
	strictEqual(converter.convert('2', '10', '0b'), undefined, 'binary: 0b is not a number');
	strictEqual(converter.convert('16', '10', '0x'), undefined, 'hexadecimal: 0x is not a number');
	strictEqual(converter.convert('16', '10', '0x.1'), undefined, 'hexadecimal: 0x.1 is not a number');
});

testConvertersOpts({
	name: 'Regression test: BigNumber errors enabled',
	extensionNames: ['extStandard'],
	Big: BigNumber.another({ ERRORS: true }),
	fn: function (converter) {
		equal(converter.to('2', 5), '101', 'to(): allow raw JavaScript numbers');
	},
});
