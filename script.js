"use strict";

//Compute the edit distance between the two given strings
function getLevenshteinMatrix(a, b) {
	if( a.length === 0 ) return b.length; 
	if( b.length === 0 ) return a.length; 
 
	var matrix = [];
 
	// increment along the first column of each row
	var i;
	for( i = 0; i <= b.length; i++ ){
		matrix[i] = [i];
	}
 
	// increment each column in the first row
	var j;
	for( j = 0; j <= a.length; j++ ){
		matrix[0][j] = j;
	}
 
	// Fill in the rest of the matrix
	for( i = 1; i <= b.length; i++ ){
		for( j = 1; j <= a.length; j++ ){
			if( b[ i-1 ] == a[ j-1 ] ) {
				matrix[i][j] = matrix[i-1][j-1]; //do nothing
			} else {
				matrix[i][j] = 
					Math.min(matrix[i-1][j-1] + 1, // substitution
					Math.min(matrix[i][j-1] + 1, // insertion
					matrix[i-1][j] + 1)); // deletion
			}
		}
	}
	
	return matrix;
}

function getEditDistance(a, b) {
	var matrix = getLevenshteinMatrix(a, b);
	return matrix[b.length][a.length];
}

function getEditPath( matrix ) { //Based on http://stackoverflow.com/a/5861206/2532489
	var editSequence = [];
	var height = matrix.length;
	var width = matrix[0].length;

	var i = height - 1;
	var j = width - 1;

	while ( !( i == 0 && j == 0 ) ) {
		var currentValue = matrix[ i ][ j ];
		var substitutionValue = matrix[ i-1 ][ j-1 ];
		var insertionValue = matrix[ i ][ j-1 ];
		var deletionValue = matrix[ i-1 ][ j ];
		var operation = "none";

		if ( substitutionValue <= insertionValue && substitutionValue <= deletionValue ) {
			if ( substitutionValue == currentValue ) {
				operation = "none";
			}
			if ( substitutionValue == currentValue - 1 ) {
				operation = "substitution";
			}

			i--;
			j--;
		} else if ( insertionValue < deletionValue && ( insertionValue == currentValue || insertionValue == currentValue - 1 ) ) {
			operation = "insertion";
			j--;
		} else {
			operation = "deletion";
			i--;
		}

		editSequence.push( operation );
	}

	return editSequence.reverse();
}

function getEditHistory( a, b, editSequence ) {
	var history = [b];

	var i = 0;
	while ( editSequence[0] !== undefined ) {
		var edit = editSequence.shift();
		switch ( edit ) {
			case "deletion":
				b = editFuncs.deletion( a, b, i );
				history.push( b );
				break;
			case "insertion":
				b = editFuncs.insertion( a, b, i );
				history.push( b );
				i++;
				break;
			case "substitution":
				b = editFuncs.substitution( a, b, i );
				history.push( b );
				i++;
				break;
			case "none":
				i++;
				break;
		}
	}

	return history;
}

function getEditStep( a, b, editSequence ) {
	var i = 0;
	loop:
	while ( editSequence[0] !== undefined ) {
		var edit = editSequence.shift();
		switch ( edit ) {
			case "deletion":
				b = editFuncs.deletion( a, b, i );
				history.push( b );
				break loop;
			case "insertion":
				b = editFuncs.insertion( a, b, i );
				history.push( b );
				i++;
				break loop;
			case "substitution":
				b = editFuncs.substitution( a, b, i );
				history.push( b );
				i++;
				break loop;
			case "none":

				i++;
				break;
		}
	}



}

var levenshteinEditFunctions = {
	deletion: function( a, b, i ) {
		return b.slice( 0, i ).concat( b.slice( i+1 ) );
	},

	insertion: function( a, b, i ) {
		return b.slice( 0, i ).concat( a.slice( i, i+1 ) ).concat( b.slice( i ) );
	},

	substitution: function( a, b, i ) {
		return b.slice( 0, i ).concat( a.slice( i, i+1 ) ).concat( b.slice( i+1 ) );
	}
}
var editFuncs = levenshteinEditFunctions;

var a = ['S', 5, 'i', {hurgh: "blurgh"}, 'a'];
var b = ['S', 'u', 'p', 'e', 'r', 'm', 'a', 'n'];


var matrix = getLevenshteinMatrix( a, b );
var editSequence = getEditPath( matrix );

console.log( editSequence );
console.log( getEditHistory( a, b, editSequence ) );